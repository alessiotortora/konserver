'use server';

import { db } from '@/db';
import { users } from '@/db/schema/users';

import { decrypt, encrypt } from '@/utils/encryption';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function generateApiKey() {
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
    // Encrypt the API key before storing
    const encryptedApiKey = encrypt(newApiKey);

    await db.update(users).set({ apiKey: encryptedApiKey }).where(eq(users.id, session.user.id));

    return { success: true, apiKey: newApiKey };
  } catch (error) {
    console.error('Error generating API key:', error);
    return {
      success: false,
      error: 'Failed to generate API key',
    };
  }
}

export async function revealApiKey() {
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

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    if (!user.apiKey) {
      return {
        success: false,
        error: 'No API key found. Please generate one first.',
      };
    }

    // Decrypt the API key before returning
    const decryptedApiKey = decrypt(user.apiKey);

    return { success: true, apiKey: decryptedApiKey };
  } catch (error) {
    console.error('Error revealing API key:', error);
    return {
      success: false,
      error: 'Failed to reveal API key',
    };
  }
}
