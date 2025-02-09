import { createClient } from '@/utils/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';

export function useVideoRealtime(
  spaceId: string,
  onVideoChange: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
) {
  const supabase = createClient();
  const callbackRef = useRef(onVideoChange);

  useEffect(() => {
    callbackRef.current = onVideoChange;
  });

  useEffect(() => {
    const channel = supabase
      .channel(`videos-${spaceId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'videos' }, (payload) => {
        if (callbackRef.current) {
          callbackRef.current(payload);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [spaceId, supabase]);
}
