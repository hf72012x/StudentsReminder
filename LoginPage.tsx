import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  const [showResetForm, setShowResetForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Reset password form setup
  const resetFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
  });
  
  type ResetFormData = z.infer<typeof resetFormSchema>;
  
  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle login form submission
  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Show confirmation email toast
      setTimeout(() => {
        const user = useAuthStore.getState().user;
        if (user) {
          toast({
            title: "Confirmation Email Sent",
            description: `We've sent a confirmation email to ${user.email}. Please check your inbox.`,
            duration: 5000
          });
        }
      }, 1500); // Delay to show after login success toast
      
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the store and displayed below
    }
  };

  // Handle reset password form submission
  const onResetSubmit = async (data: ResetFormData) => {
    try {
      await useAuthStore.getState().resetPassword(data.email);
      
      // Show password reset email toast
      toast({
        title: "Password Reset Email Sent",
        description: `We've sent password reset instructions to ${data.email}. Please check your inbox.`,
        duration: 5000
      });
      
      setShowResetForm(false);
    } catch (err) {
      // Error is handled by the store and displayed below
    }
  };
  
  // Check if user provided an email from the login form when clicking "Forgot password"
  const handleForgotPassword = () => {
    const currentEmail = form.getValues().email;
    if (currentEmail && currentEmail.includes('@')) {
      resetForm.setValue('email', currentEmail);
    }
    setShowResetForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-background/80">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo & App name */}
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">StudentsReminder</h1>
          <p className="text-muted-foreground">Keep track of your academic life</p>
        </div>
        
        <Card className="border-2 animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle>{showResetForm ? "Reset Password" : "Sign In"}</CardTitle>
            <CardDescription>
              {showResetForm
                ? "Enter your email to receive reset instructions"
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showResetForm ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="you@school.edu" 
                            autoComplete="email"
                            key="login-email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••" 
                            autoComplete="current-password"
                            key="login-password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="you@school.edu" 
                            autoComplete="email"
                            key="reset-email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <Button
              variant="link"
              className="px-0 text-primary"
              onClick={() => showResetForm ? setShowResetForm(false) : handleForgotPassword()}
            >
              {showResetForm ? "Back to login" : "Forgot password?"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}