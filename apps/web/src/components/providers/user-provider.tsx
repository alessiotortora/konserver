'use client';

import { getSafeUser } from '@/lib/actions/get/get-safe-user';
import { useUserStore } from '@/store/user-store';
import { createBrowserClient } from '@supabase/ssr';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef } from 'react';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isInitialized = useRef(false);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  const { setUser, setLoading } = useUserStore();

  const handleAuthChange = useCallback(
    async (event: AuthChangeEvent | 'INITIAL', session: Session | null) => {
      console.log('[AuthProvider] Auth state changed:', event, session?.user?.id);

      if (session?.user) {
        const safeUser = await getSafeUser();
        setUser(safeUser);

        if (event === 'SIGNED_IN' && !isInitialized.current) {
          isInitialized.current = true;
        }
      } else {
        setUser(null);

        if (event === 'SIGNED_OUT' && isInitialized.current) {
          isInitialized.current = false;
        }
      }

      setLoading(false);
    },
    [setUser, setLoading]
  );

  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange('INITIAL', session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      console.log('[AuthProvider] Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [supabase, handleAuthChange]);

  return children;
}
