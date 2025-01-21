'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function regenerateApiKey() {
  try {
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

    // Generate a new API key with nanoid
    const newApiKey = nanoid(32);

    const [user] = await db
      .update(users)
      .set({ apiKey: newApiKey })
      .where(eq(users.id, session.user.id))
      .returning();

    return { success: true, apiKey: user.apiKey };
  } catch (error) {
    console.error('Error regenerating API key:', error);
    return {
      success: false,
      error: 'Failed to regenerate API key',
    };
  }
}
