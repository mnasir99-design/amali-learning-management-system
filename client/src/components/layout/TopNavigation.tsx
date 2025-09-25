import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, GraduationCap } from "lucide-react";
import RoleSwitcher from "@/components/ui/role-switcher";
import OrgSelector from "@/components/ui/org-selector";
import type { User } from "@shared/schema";

interface TopNavigationProps {
  user: User & { organization?: any };
  currentRole: 'teacher' | 'student' | 'admin' | 'parent';
  onRoleChange: (role: 'teacher' | 'student' | 'admin' | 'parent') => void;
}

export default function TopNavigation({ user, currentRole, onRoleChange }: TopNavigationProps) {
  return (
    <nav className="bg-primary-600 text-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 mr-3" />
              <span className="text-xl font-medium">AMALI</span>
            </div>
            
            {/* Organization Selector */}
            <div className="hidden md:block">
              <OrgSelector organization={user.organization} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm opacity-90">View as:</span>
              <RoleSwitcher 
                currentRole={currentRole} 
                userRole={user.role} 
                onRoleChange={onRoleChange} 
              />
            </div>
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-white hover:bg-primary-700"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-xs rounded-full h-5 w-5 flex items-center justify-center text-white">
                3
              </span>
            </Button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <img 
                src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face`} 
                alt="User avatar" 
                className="h-8 w-8 rounded-full object-cover"
                data-testid="img-avatar"
              />
              <span className="hidden md:block text-sm" data-testid="text-username">
                {user.firstName} {user.lastName}
              </span>
              <ChevronDown className="h-4 w-4" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
                className="text-white hover:bg-primary-700 ml-2"
                data-testid="button-logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
