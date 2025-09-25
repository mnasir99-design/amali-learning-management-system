import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Star, BookOpen } from "lucide-react";

export default function StudentDashboard() {

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats']
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses']
  });

  if (statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-student-greeting">
          Welcome back, Student!
        </h1>
        <p className="text-gray-600">Ready to continue learning?</p>
      </div>

      {/* Daily Goal Progress */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Daily Goal Progress</h2>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold" data-testid="text-daily-progress">15 min</div>
                <div className="text-sm opacity-90">of 30 min completed</div>
              </div>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="3"
                />
                <path 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="3" 
                  strokeDasharray="50, 100"
                  className="progress-circle"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold" data-testid="text-progress-percentage">
                50%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak and XP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900" data-testid="text-streak">
                  {(stats as any)?.currentStreak || 7}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900" data-testid="text-total-xp">
                  {(stats as any)?.totalXP || 1250}
                </div>
                <div className="text-sm text-gray-600">Total XP</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80" 
              alt="Algebra course cover" 
              className="w-16 h-16 rounded-lg object-cover"
              data-testid="img-course-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900" data-testid="text-course-title">
                Algebra Fundamentals
              </h3>
              <p className="text-sm text-gray-600">Unit 3: Quadratic Equations</p>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500" data-testid="text-course-progress">65%</span>
                </div>
              </div>
            </div>
            <Button 
              className="bg-primary-600 text-white hover:bg-primary-700"
              data-testid="button-continue-learning"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Assignments</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200">
          <div className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900" data-testid="text-assignment-title">
                  Quadratic Formula Practice
                </h3>
                <p className="text-sm text-gray-600">Due tomorrow at 11:59 PM</p>
              </div>
              <Badge variant="destructive" data-testid="badge-high-priority">
                High Priority
              </Badge>
            </div>
          </div>
          <div className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900" data-testid="text-assignment-title-2">
                  Chapter 5 Review Questions
                </h3>
                <p className="text-sm text-gray-600">Due in 3 days</p>
              </div>
              <Badge variant="secondary" data-testid="badge-medium-priority">
                Medium Priority
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
