import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  BookOpen,
  Star,
  Zap,
  Trophy,
  BarChart3
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

interface ProgressData {
  id: string;
  courseName: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lastActivity: string;
  xpEarned: number;
  timeSpent: number; // minutes
}

interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  icon: string;
  category: "learning" | "streak" | "mastery" | "social";
}

// Demo data
const demoProgressData: ProgressData[] = [
  {
    id: "1",
    courseName: "Introduction to Mathematics",
    totalLessons: 12,
    completedLessons: 9,
    progress: 75,
    lastActivity: "2025-01-05",
    xpEarned: 450,
    timeSpent: 180
  },
  {
    id: "2",
    courseName: "Advanced Physics",
    totalLessons: 16,
    completedLessons: 7,
    progress: 44,
    lastActivity: "2025-01-04",
    xpEarned: 280,
    timeSpent: 240
  },
  {
    id: "3",
    courseName: "Creative Writing Workshop",
    totalLessons: 10,
    completedLessons: 3,
    progress: 30,
    lastActivity: "2025-01-03",
    xpEarned: 150,
    timeSpent: 120
  }
];

const demoStreak: LearningStreak = {
  currentStreak: 7,
  longestStreak: 15,
  lastStudyDate: "2025-01-05"
};

const demoAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Complete your first lesson",
    earnedDate: "2024-12-20",
    icon: "🎯",
    category: "learning"
  },
  {
    id: "2", 
    title: "Week Warrior",
    description: "Study for 7 consecutive days",
    earnedDate: "2025-01-02",
    icon: "🔥",
    category: "streak"
  },
  {
    id: "3",
    title: "Math Master",
    description: "Complete a math course with 90%+ score",
    earnedDate: "2025-01-04",
    icon: "🧮",
    category: "mastery"
  }
];

// Chart data
const weeklyProgressData = [
  { day: "Mon", xp: 65, time: 45 },
  { day: "Tue", xp: 80, time: 60 },
  { day: "Wed", xp: 45, time: 30 },
  { day: "Thu", xp: 95, time: 75 },
  { day: "Fri", xp: 70, time: 50 },
  { day: "Sat", xp: 120, time: 90 },
  { day: "Sun", xp: 85, time: 65 }
];

const monthlyProgressData = [
  { month: "Sep", completed: 8 },
  { month: "Oct", completed: 12 },
  { month: "Nov", completed: 15 },
  { month: "Dec", completed: 18 },
  { month: "Jan", completed: 22 }
];

export default function ProgressPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: progressData = demoProgressData } = useQuery({
    queryKey: ["/api/progress"],
    select: (data) => data || demoProgressData
  });

  const { data: streak = demoStreak } = useQuery({
    queryKey: ["/api/progress/streak"],
    select: (data) => data || demoStreak
  });

  const { data: achievements = demoAchievements } = useQuery({
    queryKey: ["/api/achievements"],
    select: (data) => data || demoAchievements
  });

  const totalXP = progressData.reduce((sum, course) => sum + course.xpEarned, 0);
  const totalTimeSpent = progressData.reduce((sum, course) => sum + course.timeSpent, 0);
  const totalLessonsCompleted = progressData.reduce((sum, course) => sum + course.completedLessons, 0);
  const overallProgress = Math.round(
    progressData.reduce((sum, course) => sum + course.progress, 0) / progressData.length
  );

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "learning": return "📚";
      case "streak": return "🔥";
      case "mastery": return "🏆";
      case "social": return "👥";
      default: return "⭐";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Progress" 
        description="Track your learning journey and celebrate achievements"
      />
      
      <div className="mx-auto max-w-7xl p-4">

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalXP.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Study Streak</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{streak.currentStreak}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalLessonsCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatTime(totalTimeSpent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Streak */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <span>Learning Streak</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div>
                      <div className="text-4xl font-bold text-orange-600 mb-2">
                        {streak.currentStreak}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">days in a row</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Longest Streak: {streak.longestStreak} days</span>
                      <span>Last Study: {new Date(streak.lastStudyDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Overall Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {overallProgress}%
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">average completion</p>
                    </div>
                    <Progress value={overallProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Weekly XP Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>XP earned and study time this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="time" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="mt-6">
            <div className="space-y-4">
              {progressData.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Last activity: {new Date(course.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {course.progress}% Complete
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        </div>
                        <Progress value={course.progress} className="w-full" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-600" />
                          <span>XP Earned: {course.xpEarned}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span>Time Spent: {formatTime(course.timeSpent)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Lessons Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                  <CardDescription>Lessons completed each month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Study Habits */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Habits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average Daily Study Time</span>
                      <span className="font-semibold">{formatTime(Math.round(totalTimeSpent / 7))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Most Active Day</span>
                      <span className="font-semibold">Saturday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Preferred Study Time</span>
                      <span className="font-semibold">Evening</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Learning Efficiency</span>
                      <span className="font-semibold text-green-600">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(achievement.category)} {achievement.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Locked Achievement Example */}
              <Card className="opacity-60">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">🔒</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Speed Demon
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Complete 5 lessons in one day
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      🎯 Challenge
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Progress: 2/5 lessons
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}