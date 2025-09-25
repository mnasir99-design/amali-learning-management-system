import {
  users,
  organizations,
  courses,
  courseUnits,
  lessons,
  assignments,
  assignmentSubmissions,
  courseEnrollments,
  studentProgress,
  analyticsEvents,
  type User,
  type UpsertUser,
  type Organization,
  type Course,
  type CourseUnit,
  type Lesson,
  type Assignment,
  type AssignmentSubmission,
  type CourseEnrollment,
  type StudentProgress,
  type AnalyticsEvent,
  type InsertOrganization,
  type InsertCourse,
  type InsertCourseUnit,
  type InsertLesson,
  type InsertAssignment,
  type InsertAssignmentSubmission,
  type InsertStudentProgress,
  type InsertAnalyticsEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, avg, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByOrganization(organizationId: string): Promise<User[]>;
  updateUserRole(userId: string, role: 'student' | 'teacher' | 'admin' | 'parent'): Promise<User>;
  
  // Organization operations
  getOrganization(id: string): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  getUserOrganization(userId: string): Promise<Organization | undefined>;
  
  // Course operations
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  getCoursesByTeacher(teacherId: string): Promise<Course[]>;
  getCoursesByOrganization(organizationId: string): Promise<Course[]>;
  getEnrolledCourses(studentId: string): Promise<Course[]>;
  
  // Course Unit operations
  createCourseUnit(unit: InsertCourseUnit): Promise<CourseUnit>;
  getCourseUnits(courseId: string): Promise<CourseUnit[]>;
  
  // Lesson operations
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessonsByUnit(unitId: string): Promise<Lesson[]>;
  
  // Assignment operations
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]>;
  getAssignmentsByCourse(courseId: string): Promise<Assignment[]>;
  getPendingGrading(teacherId: string): Promise<AssignmentSubmission[]>;
  
  // Assignment Submission operations
  createSubmission(submission: InsertAssignmentSubmission): Promise<AssignmentSubmission>;
  gradeSubmission(submissionId: string, score: number, feedback?: string): Promise<AssignmentSubmission>;
  getStudentSubmissions(studentId: string): Promise<AssignmentSubmission[]>;
  
  // Enrollment operations
  enrollStudent(courseId: string, studentId: string): Promise<CourseEnrollment>;
  getEnrollments(courseId: string): Promise<CourseEnrollment[]>;
  
  // Progress operations
  updateProgress(progress: InsertStudentProgress): Promise<StudentProgress>;
  getStudentProgress(studentId: string, courseId?: string): Promise<StudentProgress[]>;
  
  // Analytics operations
  logEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getDashboardStats(organizationId: string): Promise<any>;
  getTeacherInsights(teacherId: string): Promise<any>;
  getStudentInsights(studentId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsersByOrganization(organizationId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.organizationId, organizationId));
  }

  async updateUserRole(userId: string, role: 'student' | 'teacher' | 'admin' | 'parent'): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Organization operations
  async getOrganization(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async createOrganization(orgData: InsertOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(orgData).returning();
    return org;
  }

  async getUserOrganization(userId: string): Promise<Organization | undefined> {
    const result = await db
      .select({ organization: organizations })
      .from(organizations)
      .innerJoin(users, eq(users.organizationId, organizations.id))
      .where(eq(users.id, userId));
    
    return result[0]?.organization;
  }

  // Course operations
  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.teacherId, teacherId));
  }

  async getCoursesByOrganization(organizationId: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.organizationId, organizationId));
  }

  async getEnrolledCourses(studentId: string): Promise<Course[]> {
    const result = await db
      .select({ course: courses })
      .from(courses)
      .innerJoin(courseEnrollments, eq(courseEnrollments.courseId, courses.id))
      .where(eq(courseEnrollments.studentId, studentId));
    
    return result.map(r => r.course);
  }

  // Course Unit operations
  async createCourseUnit(unitData: InsertCourseUnit): Promise<CourseUnit> {
    const [unit] = await db.insert(courseUnits).values(unitData).returning();
    return unit;
  }

  async getCourseUnits(courseId: string): Promise<CourseUnit[]> {
    return await db
      .select()
      .from(courseUnits)
      .where(eq(courseUnits.courseId, courseId))
      .orderBy(courseUnits.orderIndex);
  }

  // Lesson operations
  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(lessonData).returning();
    return lesson;
  }

  async getLessonsByUnit(unitId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.unitId, unitId))
      .orderBy(lessons.orderIndex);
  }

  // Assignment operations
  async createAssignment(assignmentData: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db.insert(assignments).values(assignmentData).returning();
    return assignment;
  }

  async getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.teacherId, teacherId));
  }

  async getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.courseId, courseId));
  }

  async getPendingGrading(teacherId: string): Promise<AssignmentSubmission[]> {
    const result = await db
      .select({ submission: assignmentSubmissions })
      .from(assignmentSubmissions)
      .innerJoin(assignments, eq(assignments.id, assignmentSubmissions.assignmentId))
      .where(
        and(
          eq(assignments.teacherId, teacherId),
          eq(assignmentSubmissions.status, 'submitted')
        )
      );
    
    return result.map(r => r.submission);
  }

  // Assignment Submission operations
  async createSubmission(submissionData: InsertAssignmentSubmission): Promise<AssignmentSubmission> {
    const [submission] = await db.insert(assignmentSubmissions).values(submissionData).returning();
    return submission;
  }

  async gradeSubmission(submissionId: string, score: number, feedback?: string): Promise<AssignmentSubmission> {
    const [submission] = await db
      .update(assignmentSubmissions)
      .set({
        score,
        feedback,
        status: 'graded',
        gradedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(assignmentSubmissions.id, submissionId))
      .returning();
    return submission;
  }

  async getStudentSubmissions(studentId: string): Promise<AssignmentSubmission[]> {
    return await db
      .select()
      .from(assignmentSubmissions)
      .where(eq(assignmentSubmissions.studentId, studentId))
      .orderBy(desc(assignmentSubmissions.createdAt));
  }

  // Enrollment operations
  async enrollStudent(courseId: string, studentId: string): Promise<CourseEnrollment> {
    const [enrollment] = await db
      .insert(courseEnrollments)
      .values({ courseId, studentId })
      .returning();
    return enrollment;
  }

  async getEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    return await db.select().from(courseEnrollments).where(eq(courseEnrollments.courseId, courseId));
  }

  // Progress operations
  async updateProgress(progressData: InsertStudentProgress): Promise<StudentProgress> {
    const [progress] = await db
      .insert(studentProgress)
      .values(progressData)
      .onConflictDoUpdate({
        target: [studentProgress.studentId, studentProgress.lessonId],
        set: {
          completed: progressData.completed,
          completedAt: progressData.completedAt,
          timeSpent: progressData.timeSpent,
          updatedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  async getStudentProgress(studentId: string, courseId?: string): Promise<StudentProgress[]> {
    if (courseId) {
      const result = await db.select({ progress: studentProgress })
        .from(studentProgress)
        .innerJoin(lessons, eq(lessons.id, studentProgress.lessonId))
        .innerJoin(courseUnits, eq(courseUnits.id, lessons.unitId))
        .where(
          and(
            eq(studentProgress.studentId, studentId),
            eq(courseUnits.courseId, courseId)
          )
        );
      return result.map(r => r.progress);
    } else {
      return await db.select().from(studentProgress).where(eq(studentProgress.studentId, studentId));
    }
  }

  // Analytics operations
  async logEvent(eventData: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [event] = await db.insert(analyticsEvents).values(eventData).returning();
    return event;
  }

  async getDashboardStats(organizationId: string): Promise<any> {
    const [userStats] = await db
      .select({
        totalUsers: count(),
        activeUsers: count(users.isActive),
      })
      .from(users)
      .where(eq(users.organizationId, organizationId));

    const [courseStats] = await db
      .select({
        totalCourses: count(),
      })
      .from(courses)
      .where(eq(courses.organizationId, organizationId));

    const [engagementStats] = await db
      .select({
        avgCompletionRate: avg(courseEnrollments.completionPercentage),
      })
      .from(courseEnrollments)
      .innerJoin(courses, eq(courses.id, courseEnrollments.courseId))
      .where(eq(courses.organizationId, organizationId));

    return {
      totalUsers: userStats?.totalUsers || 0,
      activeUsers: userStats?.activeUsers || 0,
      totalCourses: courseStats?.totalCourses || 0,
      avgEngagementRate: engagementStats?.avgCompletionRate || 0,
    };
  }

  async getTeacherInsights(teacherId: string): Promise<any> {
    const [pendingGrading] = await db
      .select({ count: count() })
      .from(assignmentSubmissions)
      .innerJoin(assignments, eq(assignments.id, assignmentSubmissions.assignmentId))
      .where(
        and(
          eq(assignments.teacherId, teacherId),
          eq(assignmentSubmissions.status, 'submitted')
        )
      );

    const [courseStats] = await db
      .select({
        totalCourses: count(),
        totalStudents: sql<number>`COUNT(DISTINCT ${courseEnrollments.studentId})`,
      })
      .from(courses)
      .leftJoin(courseEnrollments, eq(courseEnrollments.courseId, courses.id))
      .where(eq(courses.teacherId, teacherId));

    return {
      pendingGrading: pendingGrading?.count || 0,
      totalCourses: courseStats?.totalCourses || 0,
      totalStudents: courseStats?.totalStudents || 0,
    };
  }

  async getStudentInsights(studentId: string): Promise<any> {
    const [progressStats] = await db
      .select({
        completedLessons: count(studentProgress.completed),
        totalXP: sql<number>`SUM(CASE WHEN ${studentProgress.completed} THEN ${lessons.xpReward} ELSE 0 END)`,
      })
      .from(studentProgress)
      .innerJoin(lessons, eq(lessons.id, studentProgress.lessonId))
      .where(eq(studentProgress.studentId, studentId));

    const [user] = await db.select().from(users).where(eq(users.id, studentId));

    return {
      completedLessons: progressStats?.completedLessons || 0,
      totalXP: progressStats?.totalXP || 0,
      currentStreak: user?.currentStreak || 0,
    };
  }
}

export const storage = new DatabaseStorage();
