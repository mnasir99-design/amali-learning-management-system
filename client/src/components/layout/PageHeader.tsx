import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/learn": "Learn",
  "/assignments": "Assignments", 
  "/progress": "Progress",
  "/messages": "Messages"
};

export default function PageHeader({ 
  title, 
  description, 
  showBackButton = true,
  backHref = "/dashboard"
}: PageHeaderProps) {
  const [location] = useLocation();

  const getBreadcrumbs = () => {
    const items = [
      { label: "Home", href: "/dashboard" }
    ];
    
    if (location !== "/dashboard") {
      items.push({ 
        label: pageTitles[location] || title, 
        href: location 
      });
    }
    
    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="border-b bg-white px-6 py-4">
      <div className="flex items-center gap-4 mb-4">
        {showBackButton && location !== "/dashboard" && (
          <Link href={backHref}>
            <Button variant="ghost" size="sm" className="p-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage data-testid={`breadcrumb-current-${item.label.toLowerCase()}`}>
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <Link href={item.href} data-testid={`breadcrumb-link-${item.label.toLowerCase()}`}>
                      <BreadcrumbLink>
                        {item.label}
                      </BreadcrumbLink>
                    </Link>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 mt-1" data-testid="text-page-description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}