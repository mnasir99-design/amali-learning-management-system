import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
  Download,
  Eye
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  points: number;
  earnedPoints?: number;
  submissionDate?: string;
  feedback?: string;
  type: "essay" | "quiz" | "project" | "homework";
}

// Demo data
const demoAssignments: Assignment[] = [
  {
    id: "1",
    title: "Algebraic Word Problems",
    description: "Solve 10 real-world mathematical problems using algebraic equations and show your work.",
    courseTitle: "Introduction to Mathematics",
    dueDate: "2025-01-10",
    status: "pending",
    points: 50,
    type: "homework"
  },
  {
    id: "2",
    title: "Physics Lab Report",
    description: "Write a comprehensive lab report on the quantum mechanics experiment conducted in class.",
    courseTitle: "Advanced Physics",
    dueDate: "2025-01-08",
    status: "submitted",
    points: 100,
    submissionDate: "2025-01-07",
    type: "project"
  },
  {
    id: "3",
    title: "Character Analysis Essay",
    description: "Analyze the protagonist's development in the assigned novel, minimum 1000 words.",
    courseTitle: "Creative Writing Workshop",
    dueDate: "2025-01-15",
    status: "graded",
    points: 75,
    earnedPoints: 68,
    submissionDate: "2025-01-14",
    feedback: "Excellent analysis of character development. Consider adding more specific textual evidence.",
    type: "essay"
  },
  {
    id: "4",
    title: "History Quiz - Chapter 5",
    description: "Multiple choice quiz covering the Industrial Revolution period.",
    courseTitle: "World History",
    dueDate: "2025-01-05",
    status: "overdue",
    points: 25,
    type: "quiz"
  },
  {
    id: "5",
    title: "Science Fair Project",
    description: "Design and conduct an original experiment demonstrating scientific principles.",
    courseTitle: "General Science",
    dueDate: "2025-01-20",
    status: "pending",
    points: 150,
    type: "project"
  }
];

export default function AssignmentsPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const { data: assignments = demoAssignments, isLoading } = useQuery({
    queryKey: ["/api/assignments"],
    select: (data) => data || demoAssignments
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case "submitted":
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Submitted</Badge>;
      case "graded":
        return <Badge variant="outline" className="text-green-600 border-green-600">Graded</Badge>;
      case "overdue":
        return <Badge variant="outline" className="text-red-600 border-red-600">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "graded":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "essay":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <CheckCircle className="h-4 w-4" />;
      case "project":
        return <Upload className="h-4 w-4" />;
      case "homework":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filterAssignments = (status: string) => {
    if (status === "all") return assignments;
    return assignments.filter(assignment => assignment.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Assignments" 
        description="Track your assignments, submissions, and grades"
      />
      
      <div className="mx-auto max-w-7xl p-4">

        {/* Assignment Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {assignments.filter(a => a.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {assignments.filter(a => a.status === "submitted").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {assignments.filter(a => a.status === "graded").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {assignments.filter(a => a.status === "overdue").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">Pending</TabsTrigger>
            <TabsTrigger value="submitted" data-testid="tab-submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded" data-testid="tab-graded">Graded</TabsTrigger>
            <TabsTrigger value="overdue" data-testid="tab-overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <div className="space-y-4">
              {filterAssignments(selectedTab).map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(assignment.type)}
                        <div className="flex-1">
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {assignment.courseTitle}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(assignment.status)}
                        {getStatusIcon(assignment.status)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {assignment.description}
                    </p>
                    
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                          {assignment.status === "pending" && (
                            <span className={`ml-2 ${getDaysUntilDue(assignment.dueDate) < 3 ? 'text-red-600' : 'text-gray-600'}`}>
                              ({getDaysUntilDue(assignment.dueDate)} days)
                            </span>
                          )}
                        </div>
                        
                        <Separator orientation="vertical" className="h-4" />
                        
                        <div>
                          <span>Points: {assignment.points}</span>
                          {assignment.earnedPoints !== undefined && (
                            <span className="ml-1 text-green-600 font-medium">
                              ({assignment.earnedPoints}/{assignment.points})
                            </span>
                          )}
                        </div>
                        
                        {assignment.submissionDate && (
                          <>
                            <Separator orientation="vertical" className="h-4" />
                            <span>Submitted: {formatDate(assignment.submissionDate)}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {assignment.status === "pending" && (
                          <Button 
                            size="sm"
                            data-testid={`button-submit-${assignment.id}`}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        )}
                        
                        {assignment.status === "submitted" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            data-testid={`button-view-submission-${assignment.id}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Submission
                          </Button>
                        )}
                        
                        {assignment.status === "graded" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            data-testid={`button-view-feedback-${assignment.id}`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            View Feedback
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          data-testid={`button-details-${assignment.id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                    
                    {assignment.feedback && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Feedback:</strong> {assignment.feedback}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {filterAssignments(selectedTab).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No assignments found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You don't have any {selectedTab === "all" ? "" : selectedTab} assignments at the moment.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}