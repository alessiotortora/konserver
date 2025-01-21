'use client';

import { regenerateApiKey } from '@/lib/actions/update/update-api-key';
import type { SafeUser } from '@/types/user';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ApiKeyManagerProps {
  user: SafeUser;
}

export function ApiKeyManager({ user }: ApiKeyManagerProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [apiKey, setApiKey] = useState(user.apiKey || '');

  async function handleRegenerate() {
    try {
      setIsRegenerating(true);
      const result = await regenerateApiKey();

      if (!result.success) {
        toast.error(result.error || 'Failed to regenerate API key');
        return;
      }

      setApiKey(result.apiKey || '');
      setIsRevealed(true);
      toast.success('API key regenerated successfully');
    } catch {
      toast.error('Failed to regenerate API key');
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          type={isRevealed ? 'text' : 'password'}
          value={apiKey}
          readOnly
          className="font-mono"
        />
        <Button variant="outline" onClick={() => setIsRevealed(!isRevealed)} className="w-24">
          {isRevealed ? 'Hide' : 'Reveal'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleRegenerate} disabled={isRegenerating}>
          {isRegenerating ? 'Regenerating...' : 'Regenerate Key'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Regenerating will invalidate the existing key
        </p>
      </div>
    </div>
  );
}
