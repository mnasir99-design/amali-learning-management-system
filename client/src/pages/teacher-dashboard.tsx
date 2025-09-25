import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  PlusCircle,
  MessageSquare,
  Calendar,
  Award,
  Eye,
  Edit,
  BarChart3
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

interface TeacherStats {
  totalStudents: number;
  activeCourses: number;
  pendingAssignments: number;
  averageGrade: number;
  totalLessons: number;
  completionRate: number;
}

interface TeacherCourse {
  id: string;
  title: string;
  studentCount: number;
  completionRate: number;
  lastActivity: string;
  upcomingAssignments: number;
}

interface StudentOverview {
  id: string;
  name: string;
  avatar: string;
  overallProgress: number;
  lastActive: string;
  currentGrade: string;
  assignmentsPending: number;
}

// Demo data
const demoTeacherStats: TeacherStats = {
  totalStudents: 87,
  activeCourses: 4,
  pendingAssignments: 12,
  averageGrade: 85.2,
  totalLessons: 156,
  completionRate: 78
};

const demoTeacherCourses: TeacherCourse[] = [
  {
    id: "1",
    title: "Advanced Mathematics",
    studentCount: 28,
    completionRate: 82,
    lastActivity: "2 hours ago",
    upcomingAssignments: 3
  },
  {
    id: "2", 
    title: "Physics Fundamentals",
    studentCount: 24,
    completionRate: 76,
    lastActivity: "4 hours ago",
    upcomingAssignments: 2
  },
  {
    id: "3",
    title: "Chemistry Lab",
    studentCount: 20,
    completionRate: 88,
    lastActivity: "1 day ago",
    upcomingAssignments: 1
  },
  {
    id: "4",
    title: "Biology Basics",
    studentCount: 15,
    completionRate: 69,
    lastActivity: "3 hours ago",
    upcomingAssignments: 6
  }
];

const demoStudents: StudentOverview[] = [
  {
    id: "1",
    name: "Emma Wilson",
    avatar: "",
    overallProgress: 92,
    lastActive: "30 minutes ago",
    currentGrade: "A",
    assignmentsPending: 1
  },
  {
    id: "2",
    name: "James Chen",
    avatar: "",
    overallProgress: 78,
    lastActive: "2 hours ago", 
    currentGrade: "B+",
    assignmentsPending: 3
  },
  {
    id: "3",
    name: "Sofia Rodriguez",
    avatar: "",
    overallProgress: 88,
    lastActive: "1 hour ago",
    currentGrade: "A-",
    assignmentsPending: 0
  },
  {
    id: "4",
    name: "Marcus Johnson",
    avatar: "",
    overallProgress: 65,
    lastActive: "5 hours ago",
    currentGrade: "B",
    assignmentsPending: 4
  }
];

export default function TeacherDashboard() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "courses" | "students" | "assignments">("overview");

  const { data: teacherStats = demoTeacherStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/teacher/stats"],
    select: (data) => data || demoTeacherStats
  });

  const { data: teacherCourses = demoTeacherCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/teacher/courses"],
    select: (data) => data || demoTeacherCourses
  });

  const { data: students = demoStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ["/api/teacher/students"],
    select: (data) => data || demoStudents
  });

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (grade.startsWith('B')) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (grade.startsWith('C')) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Teacher Dashboard" 
        description="Manage your courses, students, and assignments"
      />
      
      <div className="mx-auto max-w-7xl p-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="stat-students">
                    {teacherStats.totalStudents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="stat-courses">
                    {teacherStats.activeCourses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="stat-pending">
                    {teacherStats.pendingAssignments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Grade</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="stat-grade">
                    {teacherStats.averageGrade}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lessons</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="stat-lessons">
                    {teacherStats.totalLessons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="stat-completion">
                    {teacherStats.completionRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
              <TabsTrigger value="students" data-testid="tab-students">Students</TabsTrigger>
              <TabsTrigger value="assignments" data-testid="tab-assignments">Assignments</TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              <Button data-testid="button-create-course">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Course
              </Button>
              <Button variant="outline" data-testid="button-new-assignment">
                <FileText className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    My Courses
                  </CardTitle>
                  <CardDescription>Quick overview of your active courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teacherCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>{course.studentCount} students</span>
                          <span>{course.completionRate}% completion</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" data-testid={`view-course-${course.id}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Student Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Recent Student Activity
                  </CardTitle>
                  <CardDescription>Students who need attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {students.slice(0, 4).map((student) => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {getInitials(student.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{student.overallProgress}% progress</span>
                          <Badge className={getGradeColor(student.currentGrade)}>
                            {student.currentGrade}
                          </Badge>
                        </div>
                      </div>
                      {student.assignmentsPending > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {student.assignmentsPending} pending
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.studentCount} students enrolled</CardDescription>
                      </div>
                      <Badge variant="outline" data-testid={`course-completion-${course.id}`}>
                        {course.completionRate}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Course Progress</span>
                        <span>{course.completionRate}%</span>
                      </div>
                      <Progress value={course.completionRate} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Last activity: {course.lastActivity}</span>
                      {course.upcomingAssignments > 0 && (
                        <Badge variant="secondary">
                          {course.upcomingAssignments} assignments
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" data-testid={`manage-course-${course.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`view-analytics-${course.id}`}>
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {students.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                          {getInitials(student.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                          <Badge className={getGradeColor(student.currentGrade)}>
                            {student.currentGrade}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Overall Progress</span>
                              <span>{student.overallProgress}%</span>
                            </div>
                            <Progress value={student.overallProgress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Last active: {student.lastActive}</span>
                            {student.assignmentsPending > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {student.assignmentsPending} pending
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" data-testid={`view-student-${student.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`message-student-${student.id}`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Management</CardTitle>
                <CardDescription>Create, grade, and manage student assignments</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Assignment Management Coming Soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Full assignment creation and grading tools will be available here
                </p>
                <Button data-testid="button-create-assignment">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}