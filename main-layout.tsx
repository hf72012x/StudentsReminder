import { ReactNode, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Menu, X, LogOut, User, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
        <div className="flex items-center gap-2">
          {showSidebar && isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">StudentsReminder</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <div className="bg-background/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border shadow-sm transition-all hover:bg-background/80">
              <span className="text-sm font-medium">{user.username}</span>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          )}
          
          {!user && (
            <>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/login")}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop and when mobile sidebar is open */}
        {showSidebar && (sidebarOpen || !isMobile) && (
          <div className={cn(
            "bg-sidebar-background border-r z-20",
            isMobile 
              ? "fixed inset-y-0 left-0 w-64 transition-transform duration-300 transform" 
              : "w-64"
          )}>
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <div className="text-sidebar-foreground font-medium">Navigation</div>
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close sidebar</span>
                </Button>
              )}
            </div>
            <nav className="flex flex-col gap-1 p-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Page content */}
        <main className={cn(
          "flex-1 overflow-auto p-4 md:p-6",
          isMobile && sidebarOpen && "opacity-50"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}