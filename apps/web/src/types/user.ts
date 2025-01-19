import type { SocialLinks, User } from '@/db/schema';

// Safe user data that can be stored client-side
export interface SafeUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  location: string | null;
  bio: string | null;
  role: 'guest' | 'user' | 'admin';
  socialLinks: SocialLinks[];
  fullName: string | null;
}

// Helper to strip sensitive data and add computed properties
export function createSafeUser(user: User & { socialLinks?: SocialLinks[] }): SafeUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    bio: user.bio,
    role: user.role || 'user',
    socialLinks: user.socialLinks || [],
    // Compute full name
    get fullName() {
      if (this.firstName && this.lastName) {
        return `${this.firstName} ${this.lastName}`;
      }
      if (this.firstName) return this.firstName;
      if (this.lastName) return this.lastName;
      return null;
    },
  };
}
