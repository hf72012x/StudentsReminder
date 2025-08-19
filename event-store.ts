import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Event, EventState, User } from "@/types";
import { generateId } from "@/lib/auth-utils";
import { useAuthStore } from "./auth-store";

// Access to users (in a real app, this would be a backend API call)
const getUserById = (userId: string): User | undefined => {
  // Access the users array from the auth store
  // Note: This is a simplified approach for the demo
  const usersDb = JSON.parse(localStorage.getItem('students-reminder-auth') || '{}');
  return usersDb?.state?.user?.id === userId ? usersDb?.state?.user : undefined;
};

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      isLoading: false,
      error: null,
      
      createEvent: (eventData) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = useAuthStore.getState();
          
          if (!user) {
            set({ 
              isLoading: false, 
              error: "You must be logged in to create an event" 
            });
            return;
          }
          
          const newEvent: Event = {
            id: generateId(),
            userId: user.id,
            createdAt: new Date().toISOString(),
            ...eventData
          };
          
          set(state => ({ 
            events: [...state.events, newEvent],
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred" 
          });
        }
      },
      
      updateEvent: (id, eventData) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            events: state.events.map(event => 
              event.id === id 
                ? { 
                    ...event, 
                    ...eventData,
                    updatedAt: new Date().toISOString()
                  } 
                : event
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred" 
          });
        }
      },
      
      deleteEvent: (id) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            events: state.events.filter(event => event.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred" 
          });
        }
      },
      
      getEvents: () => {
        set({ isLoading: true, error: null });
        try {
          const { user } = useAuthStore.getState();
          
          if (!user) {
            set({ 
              events: [],
              isLoading: false
            });
            return;
          }
          
          // In a real app, this would fetch from an API
          // Show all events regardless of creator
          const events = get().events;
          
          set({ 
            events,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred" 
          });
        }
      },
      
      getEventCreatorInfo: (userId) => {
        try {
          const user = getUserById(userId);
          if (user) {
            return { username: user.username };
          }
          
          // Try to find user from the auth store if possible
          const allUsersData = Object.values(localStorage)
            .map(item => {
              try {
                return JSON.parse(item);
              } catch {
                return null;
              }
            })
            .filter(Boolean);
            
          // Find the user with matching ID
          for (const data of allUsersData) {
            if (data?.state?.user?.id === userId) {
              return { username: data.state.user.username };
            }
          }
          
          return { username: "Unknown User" };
        } catch (error) {
          console.error("Error getting creator info:", error);
          return { username: "Unknown User" };
        }
      }
    }),
    {
      name: "students-reminder-events",
      storage: createJSONStorage(() => localStorage)
    }
  )
);