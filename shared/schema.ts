import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const roleEnum = pgEnum('role', ['student', 'teacher', 'admin', 'parent']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'trial', 'canceled']);
export const assignmentStatusEnum = pgEnum('assignment_status', ['draft', 'published', 'closed']);
export const submissionStatusEnum = pgEnum('submission_status', ['pending', 'submitted', 'graded']);

// Organizations table
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  domain: varchar("domain"),
  logo: varchar("logo"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default('trial'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  organizationId: varchar("organization_id").references(() => organizations.id),
  role: roleEnum("role").default('student'),
  isActive: boolean("is_active").default(true),
  xpPoints: integer("xp_points").default(0),
  currentStreak: integer("current_streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  subject: varchar("subject"),
  organizationId: varchar("organization_id").references(() => organizations.id),
  teacherId: varchar("teacher_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course Units table
export const courseUnits = pgTable("course_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  courseId: varchar("course_id").references(() => courses.id),
  orderIndex: integer("order_index").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  content: text("content"),
  unitId: varchar("unit_id").references(() => courseUnits.id),
  orderIndex: integer("order_index").default(0),
  xpReward: integer("xp_reward").default(10),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course Enrollments table
export const courseEnrollments = pgTable("course_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id),
  studentId: varchar("student_id").references(() => users.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completionPercentage: integer("completion_percentage").default(0),
  isActive: boolean("is_active").default(true),
});

// Assignments table
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  courseId: varchar("course_id").references(() => courses.id),
  unitId: varchar("unit_id").references(() => courseUnits.id),
  teacherId: varchar("teacher_id").references(() => users.id),
  dueDate: timestamp("due_date"),
  totalPoints: integer("total_points").default(100),
  status: assignmentStatusEnum("status").default('draft'),
  xpReward: integer("xp_reward").default(20),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignment Submissions table
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").references(() => assignments.id),
  studentId: varchar("student_id").references(() => users.id),
  content: text("content"),
  status: submissionStatusEnum("status").default('pending'),
  score: integer("score"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Progress table
export const studentProgress = pgTable("student_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics Events table
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  organizationId: varchar("organization_id").references(() => organizations.id),
  eventType: varchar("event_type").notNull(),
  eventData: jsonb("event_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  courses: many(courses),
  analyticsEvents: many(analyticsEvents),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  taughtCourses: many(courses),
  enrollments: many(courseEnrollments),
  assignments: many(assignments),
  submissions: many(assignmentSubmissions),
  progress: many(studentProgress),
  analyticsEvents: many(analyticsEvents),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [courses.organizationId],
    references: [organizations.id],
  }),
  teacher: one(users, {
    fields: [courses.teacherId],
    references: [users.id],
  }),
  units: many(courseUnits),
  enrollments: many(courseEnrollments),
  assignments: many(assignments),
}));

export const courseUnitsRelations = relations(courseUnits, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseUnits.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
  assignments: many(assignments),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(courseUnits, {
    fields: [lessons.unitId],
    references: [courseUnits.id],
  }),
  progress: many(studentProgress),
}));

export const courseEnrollmentsRelations = relations(courseEnrollments, ({ one }) => ({
  course: one(courses, {
    fields: [courseEnrollments.courseId],
    references: [courses.id],
  }),
  student: one(users, {
    fields: [courseEnrollments.studentId],
    references: [users.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
  unit: one(courseUnits, {
    fields: [assignments.unitId],
    references: [courseUnits.id],
  }),
  teacher: one(users, {
    fields: [assignments.teacherId],
    references: [users.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentSubmissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [assignmentSubmissions.studentId],
    references: [users.id],
  }),
}));

export const studentProgressRelations = relations(studentProgress, ({ one }) => ({
  student: one(users, {
    fields: [studentProgress.studentId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [studentProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  user: one(users, {
    fields: [analyticsEvents.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [analyticsEvents.organizationId],
    references: [organizations.id],
  }),
}));

// Insert schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseUnitSchema = createInsertSchema(courseUnits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  timestamp: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseUnit = typeof courseUnits.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertCourseUnit = z.infer<typeof insertCourseUnitSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
