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
  Clock,
  Award,
  TrendingUp,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Star,
  Target,
  Eye
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import PageHeader from "@/components/layout/PageHeader";

interface Child {
  id: string;
  name: string;
  grade: string;
  school: string;
  avatar: string;
  overallProgress: number;
  currentGrade: string;
  streak: number;
  totalXP: number;
  lastActive: string;
}

interface ChildProgress {
  week: string;
  hoursStudied: number;
  lessonsCompleted: number;
  xpEarned: number;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
  childId: string;
}

interface TeacherMessage {
  id: string;
  teacherName: string;
  subject: string;
  message: string;
  timestamp: string;
  priority: "low" | "medium" | "high";
  childId: string;
}

// Demo data
const demoChildren: Child[] = [
  {
    id: "1",
    name: "Emma Wilson",
    grade: "8th Grade",
    school: "Lincoln Middle School",
    avatar: "",
    overallProgress: 85,
    currentGrade: "A-",
    streak: 12,
    totalXP: 2450,
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Alex Wilson",
    grade: "5th Grade", 
    school: "Lincoln Elementary",
    avatar: "",
    overallProgress: 92,
    currentGrade: "A",
    streak: 8,
    totalXP: 1890,
    lastActive: "1 hour ago"
  }
];

const demoProgressData: ChildProgress[] = [
  { week: "Week 1", hoursStudied: 8, lessonsCompleted: 12, xpEarned: 240 },
  { week: "Week 2", hoursStudied: 10, lessonsCompleted: 15, xpEarned: 300 },
  { week: "Week 3", hoursStudied: 7, lessonsCompleted: 10, xpEarned: 200 },
  { week: "Week 4", hoursStudied: 12, lessonsCompleted: 18, xpEarned: 360 },
];

const demoAssignments: Assignment[] = [
  {
    id: "1",
    title: "Algebra Word Problems",
    subject: "Mathematics",
    dueDate: "2025-01-10",
    status: "pending",
    childId: "1"
  },
  {
    id: "2",
    title: "Book Report: To Kill a Mockingbird",
    subject: "English",
    dueDate: "2025-01-12",
    status: "submitted",
    childId: "1"
  },
  {
    id: "3",
    title: "Science Fair Project",
    subject: "Science",
    dueDate: "2025-01-15",
    status: "graded",
    grade: "A-",
    childId: "2"
  }
];

const demoMessages: TeacherMessage[] = [
  {
    id: "1",
    teacherName: "Ms. Johnson",
    subject: "Mathematics Progress",
    message: "Emma is doing excellent work in algebra. She's shown great improvement in problem-solving skills.",
    timestamp: "2 days ago",
    priority: "low",
    childId: "1"
  },
  {
    id: "2", 
    teacherName: "Mr. Davis",
    subject: "Attendance Concern",
    message: "Alex was absent from PE class twice this week. Please ensure he brings his gym clothes.",
    timestamp: "1 day ago",
    priority: "medium",
    childId: "2"
  }
];

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState(demoChildren[0]?.id || "");
  const [selectedTab, setSelectedTab] = useState<"overview" | "progress" | "assignments" | "messages">("overview");

  const { data: children = demoChildren } = useQuery({
    queryKey: ["/api/parent/children"],
    select: (data) => data || demoChildren
  });

  const { data: progressData = demoProgressData } = useQuery({
    queryKey: ["/api/parent/progress", selectedChild],
    select: (data) => data || demoProgressData
  });

  const { data: assignments = demoAssignments } = useQuery({
    queryKey: ["/api/parent/assignments", selectedChild],
    select: (data) => data || demoAssignments.filter(a => a.childId === selectedChild)
  });

  const { data: messages = demoMessages } = useQuery({
    queryKey: ["/api/parent/messages", selectedChild],
    select: (data) => data || demoMessages.filter(m => m.childId === selectedChild)
  });

  const currentChild = children.find(child => child.id === selectedChild) || children[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "submitted": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "graded": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (grade.startsWith('B')) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (grade.startsWith('C')) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Parent Dashboard" 
        description="Track your children's learning progress and school activities"
      />
      
      <div className="mx-auto max-w-7xl p-4">
        {/* Child Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Children</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <Card 
                key={child.id} 
                className={`cursor-pointer transition-all ${
                  selectedChild === child.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedChild(child.id)}
                data-testid={`child-card-${child.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        {getInitials(child.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{child.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{child.grade} • {child.school}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getGradeColor(child.currentGrade)}>
                          {child.currentGrade}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {child.streak} day streak
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {currentChild && (
          <>
            {/* Selected Child Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="child-progress">
                        {currentChild.overallProgress}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Grade</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="child-grade">
                        {currentChild.currentGrade}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="child-streak">
                        {currentChild.streak}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white" data-testid="child-xp">
                        {currentChild.totalXP.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
                <TabsTrigger value="assignments" data-testid="tab-assignments">Assignments</TabsTrigger>
                <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>What {currentChild.name} has been working on</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Mathematics - Algebra Basics</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Completed lesson • Earned 25 XP</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">English - Reading Comprehension</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Submitted assignment</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Science - Chemical Reactions</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Watched video lesson</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        This Week Summary
                      </CardTitle>
                      <CardDescription>Learning highlights for {currentChild.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">8.5</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Hours Studied</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">340</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">XP Earned</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Assignments</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Study Hours</CardTitle>
                      <CardDescription>Time spent learning each week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="hoursStudied" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>XP Progress</CardTitle>
                      <CardDescription>Experience points earned over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="xpEarned" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <CardDescription>{assignment.subject}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
                          <span className="font-medium">{formatDate(assignment.dueDate)}</span>
                        </div>
                        
                        {assignment.grade && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Grade:</span>
                            <Badge className={getGradeColor(assignment.grade)}>
                              {assignment.grade}
                            </Badge>
                          </div>
                        )}

                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          data-testid={`view-assignment-${assignment.id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{message.subject}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              From: {message.teacherName} • {message.timestamp}
                            </p>
                          </div>
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{message.message}</p>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          data-testid={`reply-message-${message.id}`}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}