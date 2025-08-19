// Simple id generator
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Mock password hashing (in a real app, use a proper hashing library)
export function hashPassword(password: string): string {
  // This is a placeholder. In a real app, you'd use a library like bcrypt
  // To demonstrate the concept, we'll use a simple encoding
  return btoa(password);
}

// Mock password verification
export function verifyPassword(password: string, hash: string): boolean {
  // This is a placeholder. In a real app, you'd use a library like bcrypt
  return btoa(password) === hash;
}