'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export async function updateUserProfile(formData: UpdateProfileSchema) {
  try {
    const validatedFields = updateProfileSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const [user] = await db
      .update(users)
      .set(validatedFields.data)
      .where(eq(users.id, session.user.id))
      .returning();

    return { success: true, user };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
}
