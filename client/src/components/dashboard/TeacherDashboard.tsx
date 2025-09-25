import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  ClipboardCheck, 
  CalendarDays, 
  Check, 
  HelpCircle, 
  Star,
  Plus,
  Bot,
  Mail
} from "lucide-react";

export default function TeacherDashboard() {
  const { toast } = useToast();

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
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-greeting">
          Good morning, Teacher!
        </h1>
        <p className="text-gray-600">Here's what needs your attention today</p>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* At-Risk Students Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-semibold text-red-800">Students at Risk</h3>
            </div>
            <p className="text-red-700 mb-3 text-sm">
              3 students haven't submitted assignments in 5+ days
            </p>
            <Button 
              size="sm" 
              className="bg-red-600 text-white hover:bg-red-700"
              data-testid="button-view-at-risk-students"
            >
              View Students
            </Button>
          </CardContent>
        </Card>

        {/* Grading Queue */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <ClipboardCheck className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="font-semibold text-orange-800">Grading Queue</h3>
            </div>
            <p className="text-orange-700 mb-3 text-sm">
              {stats?.pendingGrading || 12} assignments awaiting review
            </p>
            <Button 
              size="sm" 
              className="bg-orange-600 text-white hover:bg-orange-700"
              data-testid="button-start-grading"
            >
              Start Grading
            </Button>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-semibold text-blue-800">Today's Schedule</h3>
            </div>
            <p className="text-blue-700 mb-3 text-sm">
              4 classes, next in 45 minutes
            </p>
            <Button 
              size="sm" 
              className="bg-blue-600 text-white hover:bg-blue-700"
              data-testid="button-view-schedule"
            >
              View Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Emma Thompson completed <strong>Algebra Fundamentals - Unit 3</strong>
                  </p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Marcus Chen asked for help in <strong>Quadratic Equations</strong>
                  </p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Class average improved by 12% this week
                  </p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-primary-50 text-primary-700 hover:bg-primary-100"
              variant="ghost"
              data-testid="button-create-assignment"
            >
              <Plus className="mr-3 h-4 w-4" />
              Create Assignment
            </Button>
            <Button 
              className="w-full justify-start bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
              variant="ghost"
              data-testid="button-ai-copilot"
            >
              <Bot className="mr-3 h-4 w-4" />
              AI Copilot
            </Button>
            <Button 
              className="w-full justify-start bg-accent-50 text-accent-700 hover:bg-accent-100"
              variant="ghost"
              data-testid="button-send-message"
            >
              <Mail className="mr-3 h-4 w-4" />
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Class Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Class Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600" data-testid="text-completion-rate">
                87%
              </div>
              <div className="text-sm text-gray-600">Average Completion Rate</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600" data-testid="text-improvement">
                +12%
              </div>
              <div className="text-sm text-gray-600">Weekly Improvement</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-secondary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-500" data-testid="text-active-students">
                {stats?.totalStudents || 24}
              </div>
              <div className="text-sm text-gray-600">Active Students</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-accent-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
