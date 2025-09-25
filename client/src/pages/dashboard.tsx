import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import TopNavigation from "@/components/layout/TopNavigation";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CourseModal from "@/components/modals/CourseModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = useState<'teacher' | 'student' | 'admin' | 'parent'>('teacher');
  const [showCourseModal, setShowCourseModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const renderDashboard = () => {
    switch (currentRole) {
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'parent':
        return <StudentDashboard />; // Parent view is similar to student for now
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <div className="p-6">
      {renderDashboard()}

      {/* Floating Action Button - Only show for teachers and admins */}
      {(currentRole === 'teacher' || currentRole === 'admin') && (
        <Button
          onClick={() => setShowCourseModal(true)}
          className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          data-testid="button-create-course"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <CourseModal 
        isOpen={showCourseModal} 
        onClose={() => setShowCourseModal(false)} 
      />
    </div>
  );
}
