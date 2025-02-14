'use client';

import { getSafeUser } from '@/lib/actions/get/get-safe-user';
import { useUserStore } from '@/store/user-store';
import { createBrowserClient } from '@supabase/ssr';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export function UserProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Create the Supabase client only once per render cycle.
  const supabase = useMemo(
    () => createBrowserClient(supabaseUrl, supabaseAnonKey),
    [supabaseUrl, supabaseAnonKey]
  );

  const { setUser, setLoading } = useUserStore();
  const isInitialized = useRef(false);

  // Stable handler to update the global user state on auth changes.
  const handleAuthChange = useCallback(
    async (event: AuthChangeEvent | 'INITIAL', session: Session | null) => {
      if (session?.user) {
        try {
          // Fetch the safe user from your server cache.
          const safeUser = await getSafeUser();
          setUser(safeUser);
        } catch (error) {
          console.error('[UserProvider] Error fetching safe user:', error);
          setUser(null);
        }
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
    // Fetch the initial session once when the component mounts.
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange('INITIAL', session);
    });

    // Subscribe to auth state changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, handleAuthChange]);

  return <>{children}</>;
}
