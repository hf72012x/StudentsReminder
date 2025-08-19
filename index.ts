// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = "student" | "teacher" | "admin";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sendConfirmationEmail: (user: User) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  userId: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  createEvent: (event: Omit<Event, "id" | "userId" | "createdAt">) => void;
  updateEvent: (id: string, eventData: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEvents: () => void;
  getEventCreatorInfo: (userId: string) => { username: string } | null;
}