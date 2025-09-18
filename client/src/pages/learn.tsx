import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle, 
  Star,
  TrendingUp,
  Target,
  Award
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  courseTitle: string;
  type: "video" | "reading" | "quiz" | "practice";
}

// Demo data
const demoCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Master fundamental mathematical concepts with interactive lessons and practice problems.",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9,
    estimatedTime: "4 hours",
    difficulty: "Beginner",
    category: "Mathematics"
  },
  {
    id: "2", 
    title: "Advanced Physics",
    description: "Explore complex physics principles including quantum mechanics and relativity.",
    progress: 45,
    totalLessons: 16,
    completedLessons: 7,
    estimatedTime: "8 hours",
    difficulty: "Advanced",
    category: "Science"
  },
  {
    id: "3",
    title: "Creative Writing Workshop",
    description: "Develop your writing skills through guided exercises and peer feedback.",
    progress: 30,
    totalLessons: 10,
    completedLessons: 3,
    estimatedTime: "6 hours",
    difficulty: "Intermediate",
    category: "Literature"
  }
];

const demoLessons: Lesson[] = [
  {
    id: "1",
    title: "Algebraic Equations",
    duration: "25 min",
    completed: false,
    courseTitle: "Introduction to Mathematics",
    type: "video"
  },
  {
    id: "2",
    title: "Quantum Mechanics Basics",
    duration: "35 min",
    completed: false,
    courseTitle: "Advanced Physics", 
    type: "reading"
  },
  {
    id: "3",
    title: "Character Development",
    duration: "20 min",
    completed: true,
    courseTitle: "Creative Writing Workshop",
    type: "practice"
  }
];

export default function LearnPage() {
  const [selectedTab, setSelectedTab] = useState<"courses" | "lessons">("courses");

  const { data: courses = demoCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    select: (data) => data || demoCourses
  });

  const { data: recentLessons = demoLessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["/api/lessons/recent"],
    select: (data) => data || demoLessons
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="h-4 w-4" />;
      case "reading": return <BookOpen className="h-4 w-4" />;
      case "quiz": return <Target className="h-4 w-4" />;
      case "practice": return <Award className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Learn" 
        description="Continue your learning journey with personalized courses and lessons"
      />
      
      <div className="mx-auto max-w-7xl p-4">

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Courses in Progress</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">19</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">12h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">XP Earned</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,240</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={selectedTab === "courses" ? "default" : "ghost"}
            onClick={() => setSelectedTab("courses")}
            data-testid="tab-courses"
          >
            My Courses
          </Button>
          <Button
            variant={selectedTab === "lessons" ? "default" : "ghost"}
            onClick={() => setSelectedTab("lessons")}
            data-testid="tab-lessons"
          >
            Recent Lessons
          </Button>
        </div>

        {/* Content */}
        {selectedTab === "courses" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {course.description}
                      </CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      </div>
                      <Progress value={course.progress} className="w-full" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.estimatedTime} remaining</span>
                      </div>
                      <span className="text-blue-600 font-medium">{course.category}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      data-testid={`button-continue-${course.id}`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === "lessons" && (
          <div className="space-y-4">
            {recentLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(lesson.type)}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lesson.courseTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{lesson.duration}</span>
                        </div>
                        {lesson.completed && (
                          <div className="flex items-center space-x-1 text-green-600 text-sm mt-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant={lesson.completed ? "outline" : "default"}
                        data-testid={`button-lesson-${lesson.id}`}
                      >
                        {lesson.completed ? "Review" : "Start"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}