import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // For development/demo purposes, if auth fails, provide demo user
  const isDemoMode = !user && !isLoading && error;
  const demoUser = {
    id: "demo-user",
    email: "demo@example.com",
    firstName: "Demo",
    lastName: "User",
    role: "teacher",
    organization: { id: "demo-org", name: "Demo School" }
  };

  return {
    user: isDemoMode ? demoUser : user,
    isLoading,
    isAuthenticated: !!user || isDemoMode,
  };
}
