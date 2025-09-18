import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  GraduationCap, 
  Users, 
  Shield, 
  Building2, 
  ChevronDown 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export type UserRole = "student" | "teacher" | "parent" | "admin";

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  availableRoles?: UserRole[];
}

const roleConfig = {
  student: {
    label: "Student",
    icon: User,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    description: "Learning dashboard"
  },
  teacher: {
    label: "Teacher",
    icon: GraduationCap,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    description: "Teaching and grading"
  },
  parent: {
    label: "Parent",
    icon: Users,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    description: "Track child's progress"
  },
  admin: {
    label: "Admin",
    icon: Shield,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    description: "System administration"
  }
};

export default function RoleSwitcher({ 
  currentRole, 
  onRoleChange, 
  availableRoles = ["student", "teacher", "parent", "admin"] 
}: RoleSwitcherProps) {
  const { user } = useAuth();

  const getCurrentRoleConfig = () => roleConfig[currentRole];
  const IconComponent = getCurrentRoleConfig().icon;

  return (
    <div className="flex items-center space-x-2">
      <Select 
        value={currentRole} 
        onValueChange={(value: UserRole) => onRoleChange(value)}
        data-testid="role-switcher"
      >
        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <IconComponent className="h-4 w-4" />
            <span className="font-medium">{getCurrentRoleConfig().label}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            return (
              <SelectItem key={role} value={role} data-testid={`role-option-${role}`}>
                <div className="flex items-center space-x-3 py-2">
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{config.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{config.description}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Badge 
        className={`${getCurrentRoleConfig().color} border-0`}
        data-testid={`current-role-badge-${currentRole}`}
      >
        {getCurrentRoleConfig().label} View
      </Badge>
    </div>
  );
}