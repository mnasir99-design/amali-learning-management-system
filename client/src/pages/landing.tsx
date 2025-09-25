import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, BarChart3, Zap, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">AMALI</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary-600 hover:bg-primary-700"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The Future of Learning
            <span className="text-primary-600 block">is Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AMALI is a comprehensive multi-tenant SaaS Learning Management System that combines 
            Student Information Systems, adaptive learning, and gamification with a mobile-first approach.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-3"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-primary-600 text-primary-600 hover:bg-primary-50"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Modern Education</h2>
          <p className="text-lg text-gray-600">Everything you need to deliver exceptional learning experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary-600 mb-4" />
              <CardTitle>Multi-Tenant Architecture</CardTitle>
              <CardDescription>
                Securely manage multiple organizations with role-based access control and data isolation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-secondary-500 mb-4" />
              <CardTitle>Course Authoring</CardTitle>
              <CardDescription>
                Create engaging courses with multimedia content, assessments, and SCORM support.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-accent-500 mb-4" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Track student progress, engagement metrics, and learning outcomes with detailed reports.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary-600 mb-4" />
              <CardTitle>Gamification</CardTitle>
              <CardDescription>
                Motivate learners with XP points, achievements, streaks, and interactive progress tracking.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-secondary-500 mb-4" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                SAML/OIDC SSO, SCIM provisioning, and compliance with educational data privacy standards.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-accent-500 mb-4" />
              <CardTitle>Student Information System</CardTitle>
              <CardDescription>
                Complete SIS functionality including roster management, attendance tracking, and gradebook.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Education Experience?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of educators and students who are already using AMALI to achieve better learning outcomes.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            data-testid="button-start-free-trial"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary-400 mr-3" />
              <span className="text-2xl font-bold">AMALI</span>
            </div>
            <p className="text-gray-400">
              Empowering educators and learners with innovative technology solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
