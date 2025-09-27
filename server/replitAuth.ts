import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// REPLIT_DOMAINS check moved to setupAuth function for conditional AWS support

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true, // Allow table creation for AWS
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-aws-demo',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  // Check if user exists
  const existingUser = await storage.getUser(claims["sub"]);

  if (!existingUser) {
    // Create default organization for new users
    const organization = await storage.createOrganization({
      name: `${claims["first_name"] || claims["email"] || "User"}'s Organization`,
      domain: `org-${claims["sub"]}`,
    });

    // Create user with organization and default role
    await storage.upsertUser({
      id: claims["sub"],
      email: claims["email"],
      firstName: claims["first_name"],
      lastName: claims["last_name"],
      profileImageUrl: claims["profile_image_url"],
      organizationId: organization.id,
      role: "teacher", // Default role
    });
  } else {
    // Update existing user info
    await storage.upsertUser({
      id: claims["sub"],
      email: claims["email"],
      firstName: claims["first_name"],
      lastName: claims["last_name"],
      profileImageUrl: claims["profile_image_url"],
      organizationId: existingUser.organizationId,
      role: existingUser.role,
    });
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Check if we're in an AWS environment or if Replit auth should be disabled
  const isAWSEnvironment = process.env.NODE_ENV === 'production' || 
    !process.env.REPL_ID || 
    !process.env.REPLIT_DOMAINS;

  if (isAWSEnvironment) {
    console.log('[AUTH] Running in AWS environment - Replit authentication disabled');
    // Set up a basic session serialization for AWS
    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));
    return; // Skip Replit OIDC setup
  }

  // Check required environment variables for Replit auth
  if (!process.env.REPLIT_DOMAINS) {
    throw new Error("Environment variable REPLIT_DOMAINS not provided");
  }

  try {
    const config = await getOidcConfig();

    const verify: VerifyFunction = async (
      tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
      verified: passport.AuthenticateCallback
    ) => {
      const user = {};
      updateUserSession(user, tokens);
      await upsertUser(tokens.claims());
      verified(null, user);
    };

    for (const domain of process.env
      .REPLIT_DOMAINS!.split(",")) {
      const strategy = new Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
    }

    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));

    app.get("/api/login", (req, res, next) => {
      passport.authenticate(`replitauth:${req.hostname}`, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    });

    app.get("/api/callback", (req, res, next) => {
      passport.authenticate(`replitauth:${req.hostname}`, {
        successReturnToOrRedirect: "/",
        failureRedirect: "/api/login",
      })(req, res, next);
    });

    app.get("/api/logout", (req, res) => {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.redirect("/");
      });
    });
  } catch (error) {
    console.error('Failed to set up Replit authentication:', error);
    throw error;
  }
}

export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  // AWS environment: create mock user for demo
  const isAWSEnvironment = process.env.NODE_ENV === 'production' || 
    !process.env.REPL_ID || 
    !process.env.REPLIT_DOMAINS;

  if (isAWSEnvironment) {
    // Create a mock user for AWS demo
    req.user = {
      claims: {
        sub: "aws-demo-user-123",
        email: "admin@amali-demo.com",
        first_name: "Demo",
        last_name: "Admin",
        profile_image_url: null
      }
    };
    return next();
  }

  // Replit environment: check actual authentication
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: "Unauthorized" });
};
