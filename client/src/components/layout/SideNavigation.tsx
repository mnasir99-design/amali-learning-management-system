import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Calendar, 
  ClipboardList, 
  BarChart3, 
  Users, 
  MessageCircle,
  BookOpen,
  HelpCircle,
  PlayCircle,
  TrendingUp,
  UserPlus,
  GraduationCap,
  CreditCard,
  UserCog,
  Settings
} from "lucide-react";

interface SideNavigationProps {
  currentRole: 'teacher' | 'student' | 'admin' | 'parent';
}

const teacherNavItems = [
  { icon: Home, label: "Today", path: "/dashboard", badge: "5" },
  { icon: Calendar, label: "Plan", path: "/dashboard" },
  { icon: ClipboardList, label: "Grade", path: "/assignments", badge: "12", badgeColor: "bg-red-500" },
  { icon: BarChart3, label: "Insights", path: "/progress" },
  { icon: Users, label: "Roster", path: "/dashboard" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
];

const teacherContentItems = [
  { icon: BookOpen, label: "Courses", path: "/learn" },
  { icon: HelpCircle, label: "Item Bank", path: "/dashboard" },
];

const studentNavItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: PlayCircle, label: "Learn", path: "/learn" },
  { icon: ClipboardList, label: "Assignments", path: "/assignments", badge: "3" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
];

const adminNavItems = [
  { icon: BarChart3, label: "Overview", path: "/admin/overview" },
  { icon: UserPlus, label: "Admissions", path: "/admin/admissions" },
  { icon: GraduationCap, label: "Academics", path: "/admin/academics" },
  { icon: CreditCard, label: "Billing", path: "/admin/billing" },
  { icon: UserCog, label: "Users/SSO", path: "/admin/users" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function SideNavigation({ currentRole }: SideNavigationProps) {
  const [location] = useLocation();
  const getNavItems = () => {
    switch (currentRole) {
      case 'teacher':
        return {
          main: teacherNavItems,
          secondary: { title: "Content", items: teacherContentItems }
        };
      case 'student':
      case 'parent':
        return {
          main: studentNavItems,
          secondary: null
        };
      case 'admin':
        return {
          main: adminNavItems,
          secondary: null
        };
      default:
        return {
          main: teacherNavItems,
          secondary: { title: "Content", items: teacherContentItems }
        };
    }
  };

  const { main, secondary } = getNavItems();

  return (
    <aside className="bg-white w-64 shadow-lg overflow-y-auto transition-all duration-300">
      <nav className="p-4 space-y-1">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          {currentRole === 'student' || currentRole === 'parent' ? 'Learning' : 
           currentRole === 'admin' ? 'Management' : 'Main'}
        </div>
        
        {main.map((item, index) => {
          const isActive = location === item.path;
          return (
            <Link
              key={index}
              href={item.path}
              className={cn(
                "nav-item flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "active bg-primary-50 text-primary-700" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
              {(item as any).badge && (
                <span className={cn(
                  "ml-auto text-white text-xs px-2 py-1 rounded-full",
                  (item as any).badgeColor || "bg-accent-500"
                )}>
                  {(item as any).badge}
                </span>
              )}
            </Link>
          );
        })}

        {secondary && (
          <>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 mt-6">
              {secondary.title}
            </div>
            {secondary.items.map((item, index) => {
              const isActive = location === item.path;
              return (
                <Link
                  key={index}
                  href={item.path}
                  className={cn(
                    "nav-item flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "active bg-primary-50 text-primary-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
}
