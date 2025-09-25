import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users,
  School,
  BookOpen,
  TrendingUp,
  Settings,
  Shield,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  DollarSign,
  Calendar,
  UserPlus,
  GraduationCap,
  CreditCard
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import PageHeader from "@/components/layout/PageHeader";

interface AdminDashboardProps {
  section?: string;
}

interface SystemStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeUsers: number;
  systemUptime: string;
  storageUsed: number;
  totalOrganizations: number;
}

interface OrganizationOverview {
  id: string;
  name: string;
  type: string;
  studentCount: number;
  teacherCount: number;
  subscriptionStatus: string;
  lastActivity: string;
}

interface UserManagement {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  lastLogin: string;
  status: "active" | "inactive" | "suspended";
}

interface SystemMetrics {
  date: string;
  activeUsers: number;
  coursesCreated: number;
  assignmentsSubmitted: number;
}

// Demo data
const demoSystemStats: SystemStats = {
  totalStudents: 15420,
  totalTeachers: 842,
  totalCourses: 156,
  activeUsers: 12380,
  systemUptime: "99.9%",
  storageUsed: 78,
  totalOrganizations: 34
};

const demoOrganizations: OrganizationOverview[] = [
  {
    id: "1",
    name: "Lincoln High School",
    type: "High School",
    studentCount: 1250,
    teacherCount: 78,
    subscriptionStatus: "active",
    lastActivity: "2 hours ago"
  },
  {
    id: "2", 
    name: "Roosevelt Elementary",
    type: "Elementary School",
    studentCount: 450,
    teacherCount: 32,
    subscriptionStatus: "active",
    lastActivity: "1 hour ago"
  },
  {
    id: "3",
    name: "Jefferson Middle School", 
    type: "Middle School",
    studentCount: 680,
    teacherCount: 45,
    subscriptionStatus: "trial",
    lastActivity: "1 hour ago"
  }
];

const demoUsers: UserManagement[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@lincoln.edu",
    role: "teacher",
    organization: "Lincoln High School",
    lastLogin: "2 hours ago",
    status: "active"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@roosevelt.edu",
    role: "admin",
    organization: "Roosevelt Elementary",
    lastLogin: "1 day ago", 
    status: "active"
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.w@student.lincoln.edu",
    role: "student",
    organization: "Lincoln High School",
    lastLogin: "30 minutes ago",
    status: "active"
  },
  {
    id: "4",
    name: "Mr. & Mrs. Wilson",
    email: "parents.wilson@gmail.com",
    role: "parent",
    organization: "Lincoln High School",
    lastLogin: "1 hour ago",
    status: "active"
  }
];

const demoMetrics: SystemMetrics[] = [
  { date: "Jan 1", activeUsers: 1150, coursesCreated: 12, assignmentsSubmitted: 145 },
  { date: "Jan 2", activeUsers: 1200, coursesCreated: 8, assignmentsSubmitted: 167 },
  { date: "Jan 3", activeUsers: 1180, coursesCreated: 15, assignmentsSubmitted: 189 },
  { date: "Jan 4", activeUsers: 1250, coursesCreated: 10, assignmentsSubmitted: 156 },
  { date: "Jan 5", activeUsers: 1300, coursesCreated: 18, assignmentsSubmitted: 201 },
  { date: "Jan 6", activeUsers: 1280, coursesCreated: 14, assignmentsSubmitted: 178 },
  { date: "Jan 7", activeUsers: 1350, coursesCreated: 22, assignmentsSubmitted: 234 }
];

export default function AdminDashboard({ section = "overview" }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: systemStats = demoSystemStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    select: (data) => data || demoSystemStats
  });

  const { data: organizations = demoOrganizations } = useQuery({
    queryKey: ["/api/admin/organizations"], 
    select: (data) => data || demoOrganizations
  });

  const { data: users = demoUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    select: (data) => data || demoUsers
  });

  const { data: metrics = demoMetrics } = useQuery({
    queryKey: ["/api/admin/metrics"],
    select: (data) => data || demoMetrics
  });

  const getSectionTitle = () => {
    switch (section) {
      case "overview": return "Admin Overview";
      case "admissions": return "Admissions Management";
      case "academics": return "Academic Management";
      case "billing": return "Billing & Subscriptions";
      case "users": return "User Management";
      case "reports": return "Reports & Analytics";
      case "settings": return "System Settings";
      default: return "Admin Dashboard";
    }
  };

  const getSectionDescription = () => {
    switch (section) {
      case "overview": return "System overview and key metrics";
      case "admissions": return "Manage student enrollment and applications";
      case "academics": return "Academic programs and curriculum management";
      case "billing": return "Subscription plans and payment management";
      case "users": return "User accounts and access control";
      case "reports": return "Analytics and performance reports";
      case "settings": return "System configuration and preferences";
      default: return "System administration and user management";
    }
  };

  const renderOverviewSection = () => (
    <>
      {/* System Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats.totalStudents.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <School className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Teachers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats.totalTeachers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats.totalCourses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats.activeUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats.systemUptime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Storage</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats.storageUsed}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Organizations</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats.totalOrganizations}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Organizations Overview</CardTitle>
          <CardDescription>Active educational institutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organizations.map((org) => (
              <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <School className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{org.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{org.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">{org.studentCount}</p>
                    <p>Students</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">{org.teacherCount}</p>
                    <p>Teachers</p>
                  </div>
                  <Badge className={org.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {org.subscriptionStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderAdmissionsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-orange-600" />
              <p className="text-2xl font-semibold">127</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Approved This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-2xl font-semibold">89</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <p className="text-2xl font-semibold">78%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest student enrollment applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Student Application #{1000 + i}</h4>
                  <p className="text-sm text-gray-600">Applied for Grade {9 + i} • Lincoln High School</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Review</Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAcademicsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <p className="text-2xl font-semibold">156</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <p className="text-2xl font-semibold">24</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Curriculum Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <p className="text-2xl font-semibold">8</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <p className="text-2xl font-semibold">92%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Programs</CardTitle>
          <CardDescription>Manage curriculum and course offerings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Mathematics', 'Science', 'English Language Arts', 'Social Studies'].map((subject, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{subject}</h4>
                  <p className="text-sm text-gray-600">{12 + i} courses • {150 + i * 50} students enrolled</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <p className="text-2xl font-semibold">$48,720</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <p className="text-2xl font-semibold">34</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-2xl font-semibold">3</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trial Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <p className="text-2xl font-semibold">85%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage organization billing and subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organizations.map((org) => (
              <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{org.name}</h4>
                  <p className="text-sm text-gray-600">
                    {org.studentCount + org.teacherCount} users • ${((org.studentCount + org.teacherCount) * 12).toLocaleString()}/month
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={org.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {org.subscriptionStatus}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Billing
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsersSection = () => {
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <p className="text-2xl font-semibold">{systemStats.totalStudents + systemStats.totalTeachers}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-2xl font-semibold">{systemStats.activeUsers}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-purple-600" />
                <p className="text-2xl font-semibold">247</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inactive Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <p className="text-2xl font-semibold">18</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.organization} • Last login: {user.lastLogin}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                      {user.role}
                    </Badge>
                    <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {user.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderReportsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
          <CardDescription>Platform usage and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="activeUsers" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="coursesCreated" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="assignmentsSubmitted" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activeUsers" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="coursesCreated" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Maintenance Mode</span>
              <Button variant="outline" size="sm">Disabled</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Auto Backup</span>
              <Button variant="outline" size="sm">Daily</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Email Notifications</span>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Two-Factor Auth</span>
              <Button variant="outline" size="sm">Required</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Session Timeout</span>
              <Button variant="outline" size="sm">24 hours</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Login Attempts</span>
              <Button variant="outline" size="sm">5 max</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>Recent system activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "User login: admin@lincoln.edu - 2 minutes ago",
              "Database backup completed - 1 hour ago", 
              "New organization registered: Jefferson Middle - 3 hours ago",
              "System update applied - 1 day ago",
              "Security scan completed - 1 day ago"
            ].map((log, i) => (
              <div key={i} className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm">{log}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSectionContent = () => {
    switch (section) {
      case "overview": return renderOverviewSection();
      case "admissions": return renderAdmissionsSection();
      case "academics": return renderAcademicsSection();
      case "billing": return renderBillingSection();
      case "users": return renderUsersSection();
      case "reports": return renderReportsSection();
      case "settings": return renderSettingsSection();
      default: return renderOverviewSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title={getSectionTitle()}
        description={getSectionDescription()}
      />
      
      <div className="mx-auto max-w-7xl p-4">
        {renderSectionContent()}
      </div>
    </div>
  );
}