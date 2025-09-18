import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSwitcherProps {
  currentRole: 'teacher' | 'student' | 'admin' | 'parent';
  userRole: 'teacher' | 'student' | 'admin' | 'parent';
  onRoleChange: (role: 'teacher' | 'student' | 'admin' | 'parent') => void;
}

export default function RoleSwitcher({ currentRole, userRole, onRoleChange }: RoleSwitcherProps) {
  // Allow role switching based on user's actual role
  const availableRoles = () => {
    const roles = [userRole];
    
    // Admins can view as any role
    if (userRole === 'admin') {
      return ['admin', 'teacher', 'student', 'parent'];
    }
    
    // Teachers can view as student
    if (userRole === 'teacher') {
      return ['teacher', 'student'];
    }
    
    return roles;
  };

  const roleLabels = {
    teacher: 'Teacher',
    student: 'Student', 
    admin: 'Admin',
    parent: 'Parent'
  };

  return (
    <Select value={currentRole} onValueChange={onRoleChange}>
      <SelectTrigger className="bg-primary-700 text-white border-0 text-sm min-w-[100px]" data-testid="select-role">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableRoles().map((role) => (
          <SelectItem key={role} value={role} data-testid={`role-option-${role}`}>
            {roleLabels[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
