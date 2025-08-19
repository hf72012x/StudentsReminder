import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, User, UserRole } from "@/types";
import { generateId, hashPassword, verifyPassword } from "@/lib/auth-utils";

// Mock user database (in a real app, this would be a backend API)
let usersDb: User[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    role: "student" as UserRole,
    createdAt: new Date().toISOString()
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      sendConfirmationEmail: async (user: User) => {
        // In a real app, this would send an actual email
        console.log(`Confirmation email sent to ${user.email}`);
        // Toast notification will be shown by the calling component
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user by email (in a real app, this would be a backend API call)
          const user = usersDb.find(user => user.email === email);
          
          if (!user) {
            set({ isLoading: false, error: "Invalid email or password" });
            return;
          }
          
          // In a mock environment, we'll accept any password for the demo user
          // In a real app, we would verify the password hash
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          // Send confirmation email after successful login
          const currentState = useAuthStore.getState();
          currentState.sendConfirmationEmail(user);
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred" 
          });
        }
      },
      
      signup: async (username: string, email: string, password: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists (in a real app, this would be a backend API call)
          const userExists = usersDb.some(user => user.email === email);
          
          if (userExists) {
            set({ isLoading: false, error: "Email already in use" });
            return;
          }
          
          // Create new user (in a real app, this would be a backend API call)
          const newUser: User = {
            id: generateId(),
            username,
            email,
            role,
            createdAt: new Date().toISOString()
          };
          
          // Add to mock database
          usersDb = [...usersDb, newUser];
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred" 
          });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists (in a real app, this would be a backend API call)
          const user = usersDb.find(user => user.email === email);
          
          if (!user) {
            set({ isLoading: false, error: "Email not found" });
            return;
          }
          
          // Simulate sending a password reset email
          console.log(`Password reset email sent to ${email}`);
          // Toast notification will be shown by the calling component
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred" 
          });
        }
      },
      
      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would verify the current password and update it
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred" 
          });
        }
      }
    }),
    {
      name: "students-reminder-auth",
      storage: createJSONStorage(() => localStorage)
    }
  )
);