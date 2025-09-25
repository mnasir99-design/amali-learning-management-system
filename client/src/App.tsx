import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Learn from "@/pages/learn";
import Assignments from "@/pages/assignments";
import Progress from "@/pages/progress";
import Messages from "@/pages/messages";
import TeacherDashboard from "@/pages/teacher-dashboard";
import ParentDashboard from "@/pages/parent-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import SideNavigation from "@/components/layout/SideNavigation";
import RoleSwitcher, { type UserRole } from "@/components/RoleSwitcher";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole>("student");

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
  };

  const renderDashboard = () => {
    switch (currentRole) {
      case "teacher":
        return <TeacherDashboard />;
      case "parent":
        return <ParentDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {isAuthenticated && <SideNavigation currentRole={currentRole} />}
      <main className="flex-1 overflow-auto">
        {/* Role Switcher - shown when authenticated */}
        {isAuthenticated && (
          <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AMALI Learning Platform
                </h2>
              </div>
              <RoleSwitcher 
                currentRole={currentRole} 
                onRoleChange={handleRoleChange}
                availableRoles={["student", "teacher", "parent", "admin"]}
              />
            </div>
          </div>
        )}

        <Switch>
          {isLoading || !isAuthenticated ? (
            <Route path="/" component={Landing} />
          ) : (
            <>
              <Route path="/" component={renderDashboard} />
              <Route path="/dashboard" component={renderDashboard} />
              <Route path="/learn" component={Learn} />
              <Route path="/assignments" component={Assignments} />
              <Route path="/progress" component={Progress} />
              <Route path="/messages" component={Messages} />
              
              {/* Admin Routes */}
              <Route path="/admin/overview" component={() => <AdminDashboard section="overview" />} />
              <Route path="/admin/admissions" component={() => <AdminDashboard section="admissions" />} />
              <Route path="/admin/academics" component={() => <AdminDashboard section="academics" />} />
              <Route path="/admin/billing" component={() => <AdminDashboard section="billing" />} />
              <Route path="/admin/users" component={() => <AdminDashboard section="users" />} />
              <Route path="/admin/reports" component={() => <AdminDashboard section="reports" />} />
              <Route path="/admin/settings" component={() => <AdminDashboard section="settings" />} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
