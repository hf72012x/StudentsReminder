import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LandingPage() {
  const isMobile = useIsMobile();

  const features = [
    {
      title: "Easy Event Management",
      description: "Create and manage school events with just a few clicks.",
      icon: Calendar,
    },
    {
      title: "User-friendly Interface",
      description: "Simple and intuitive design for effortless event planning.",
      icon: CheckCircle2,
    },
    {
      title: "Secure Authentication",
      description: "Your data is protected with secure account management.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background px-4 py-3 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">StudentsReminder</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size={isMobile ? "sm" : "default"}>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
                Never miss another
                <span className="text-primary block">school assignment</span>
                or important event
              </h1>
              <p className="text-xl text-muted-foreground">
                StudentsReminder helps you stay organized with a simple and effective way to track
                all your academic events and deadlines.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-background to-muted p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Math Exam</h3>
                    <span className="text-sm text-muted-foreground">Tomorrow</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted">
                    <div className="h-1 w-2/3 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Physics Report</h3>
                    <span className="text-sm text-muted-foreground">Due in 3 days</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted">
                    <div className="h-1 w-1/3 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Literature Essay</h3>
                    <span className="text-sm text-muted-foreground">Due next week</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted">
                    <div className="h-1 w-1/5 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for students to help manage your academic life efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-card p-6 rounded-lg border shadow-sm text-center"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using StudentsReminder to stay organized and
            on top of their academic responsibilities.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="mr-4">
              Sign Up Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-bold">StudentsReminder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StudentsReminder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}