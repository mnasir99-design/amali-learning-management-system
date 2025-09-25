import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { 
  insertCourseSchema,
  insertCourseUnitSchema,
  insertLessonSchema,
  insertAssignmentSchema,
  insertAssignmentSubmissionSchema,
  insertStudentProgressSchema,
  insertAnalyticsEventSchema,
  assignmentSubmissions,
  assignments,
  courses,
} from "@shared/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Elastic Beanstalk
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const organization = await storage.getUserOrganization(userId);
      res.json({ ...user, organization });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.organizationId) {
        return res.status(400).json({ message: "User not associated with organization" });
      }

      let stats;
      if (user.role === 'admin') {
        stats = await storage.getDashboardStats(user.organizationId);
      } else if (user.role === 'teacher') {
        stats = await storage.getTeacherInsights(userId);
      } else if (user.role === 'student') {
        stats = await storage.getStudentInsights(userId);
      }

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Course routes
  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const courseData = insertCourseSchema.parse({
        ...req.body,
        teacherId: userId,
        organizationId: user.organizationId,
      });

      const course = await storage.createCourse(courseData);
      
      // Log analytics event
      await storage.logEvent({
        userId,
        organizationId: user.organizationId!,
        eventType: 'course_created',
        eventData: { courseId: course.id, title: course.title },
      });

      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.get('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let courses;
      if (user.role === 'teacher') {
        courses = await storage.getCoursesByTeacher(userId);
      } else if (user.role === 'student') {
        courses = await storage.getEnrolledCourses(userId);
      } else if (user.role === 'admin') {
        courses = await storage.getCoursesByOrganization(user.organizationId!);
      }

      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Course Units routes
  app.post('/api/courses/:courseId/units', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const { courseId } = req.params;
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const unitData = insertCourseUnitSchema.parse({
        ...req.body,
        courseId,
      });

      const unit = await storage.createCourseUnit(unitData);
      res.json(unit);
    } catch (error) {
      console.error("Error creating course unit:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid unit data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course unit" });
    }
  });

  app.get('/api/courses/:courseId/units', isAuthenticated, async (req: any, res) => {
    try {
      const { courseId } = req.params;
      const units = await storage.getCourseUnits(courseId);
      res.json(units);
    } catch (error) {
      console.error("Error fetching course units:", error);
      res.status(500).json({ message: "Failed to fetch course units" });
    }
  });

  // Lessons routes
  app.post('/api/units/:unitId/lessons', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const { unitId } = req.params;
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const lessonData = insertLessonSchema.parse({
        ...req.body,
        unitId,
      });

      const lesson = await storage.createLesson(lessonData);
      res.json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lesson data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  app.get('/api/units/:unitId/lessons', isAuthenticated, async (req: any, res) => {
    try {
      const { unitId } = req.params;
      const lessons = await storage.getLessonsByUnit(unitId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  // Assignments routes
  app.post('/api/assignments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const assignmentData = insertAssignmentSchema.parse({
        ...req.body,
        teacherId: userId,
      });

      const assignment = await storage.createAssignment(assignmentData);
      res.json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  app.get('/api/assignments/pending-grading', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const submissions = await storage.getPendingGrading(userId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching pending grading:", error);
      res.status(500).json({ message: "Failed to fetch pending grading" });
    }
  });

  // Assignment Submissions routes
  app.post('/api/assignments/:assignmentId/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { assignmentId } = req.params;

      const submissionData = insertAssignmentSubmissionSchema.parse({
        ...req.body,
        assignmentId,
        studentId: userId,
        status: 'submitted',
        submittedAt: new Date(),
      });

      const submission = await storage.createSubmission(submissionData);
      res.json(submission);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit assignment" });
    }
  });

  app.put('/api/submissions/:submissionId/grade', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const { submissionId } = req.params;
      const { score, feedback } = req.body;
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      if (!user.organizationId) {
        return res.status(400).json({ message: "User not associated with organization" });
      }

      // Get submission details to verify ownership
      const [submission] = await db.select()
        .from(assignmentSubmissions)
        .where(eq(assignmentSubmissions.id, submissionId));

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Get assignment details to verify teacher ownership and organization
      const [assignment] = await db.select()
        .from(assignments)
        .where(eq(assignments.id, submission.assignmentId!));

      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      // Verify organization ownership (multi-tenant security)
      const [course] = await db.select()
        .from(courses)
        .where(eq(courses.id, assignment.courseId!));

      if (!course || course.organizationId !== user.organizationId) {
        return res.status(403).json({ message: "Access denied: assignment not in your organization" });
      }

      // For teachers, verify they own the assignment
      if (user.role === 'teacher' && assignment.teacherId !== userId) {
        return res.status(403).json({ message: "Access denied: you can only grade your own assignments" });
      }

      const gradedSubmission = await storage.gradeSubmission(submissionId, score, feedback);
      res.json(gradedSubmission);
    } catch (error) {
      console.error("Error grading submission:", error);
      res.status(500).json({ message: "Failed to grade submission" });
    }
  });

  // Student Progress routes
  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      const progressData = insertStudentProgressSchema.parse({
        ...req.body,
        studentId: userId,
      });

      const progress = await storage.updateProgress(progressData);
      
      // Update user XP if lesson completed
      if (progress.completed) {
        const user = await storage.getUser(userId);
        if (user) {
          // Log analytics event
          await storage.logEvent({
            userId,
            organizationId: user.organizationId!,
            eventType: 'lesson_completed',
            eventData: { lessonId: progress.lessonId },
          });
        }
      }

      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Enrollment routes
  app.post('/api/courses/:courseId/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { courseId } = req.params;

      const enrollment = await storage.enrollStudent(courseId, userId);
      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling student:", error);
      res.status(500).json({ message: "Failed to enroll student" });
    }
  });

  // Organization routes
  app.get('/api/organizations/:orgId/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const { orgId } = req.params;
      
      if (user?.role !== 'admin' || user.organizationId !== orgId) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const users = await storage.getUsersByOrganization(orgId);
      res.json(users);
    } catch (error) {
      console.error("Error fetching organization users:", error);
      res.status(500).json({ message: "Failed to fetch organization users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
