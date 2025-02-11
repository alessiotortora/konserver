'use client';

import { generateApiKey, revealApiKey } from '@/lib/actions/api-keys';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function ApiKeyManager() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  async function handleRegenerate() {
    try {
      setIsRegenerating(true);
      const result = await generateApiKey();

      if (!result.success) {
        toast.error(result.error || 'Failed to generate API key');
        return;
      }

      setHasApiKey(true);
      toast.success('API key generated successfully');
      // Reset the revealed state and API key
      setIsRevealed(false);
      setApiKey('');
    } catch {
      toast.error('Failed to generate API key');
    } finally {
      setIsRegenerating(false);
    }
  }

  async function handleReveal() {
    if (isRevealed) {
      setIsRevealed(false);
      setApiKey('');
      return;
    }

    try {
      setIsLoading(true);
      const result = await revealApiKey();

      if (!result.success) {
        if (result.error === 'No API key found. Please generate one first.') {
          setHasApiKey(false);
        }
        toast.error(result.error || 'Failed to reveal API key');
        return;
      }

      setHasApiKey(true);
      setApiKey(result.apiKey || '');
      setIsRevealed(true);
    } catch {
      toast.error('Failed to reveal API key');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          type={isRevealed ? 'text' : 'password'}
          value={apiKey}
          readOnly
          placeholder={isRevealed ? 'No API key generated' : '••••••••••••••••'}
          className="font-mono"
        />
        <Button
          variant="outline"
          onClick={handleReveal}
          className="w-24"
          disabled={isLoading || hasApiKey === false}
        >
          {isLoading ? 'Loading...' : isRevealed ? 'Hide' : 'Reveal'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={isRegenerating}>
              {isRegenerating ? 'Generating...' : hasApiKey ? 'Generate New Key' : 'Generate Key'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Generate New API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to generate a new API key? This action cannot be undone and
                will invalidate your existing key. Any applications or services using the current
                key will stop working until updated with the new key.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRegenerate}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="text-sm text-muted-foreground">
          {hasApiKey
            ? 'Generating a new key will invalidate the existing one'
            : 'Generate an API key to access the API'}
        </p>
      </div>
    </div>
  );
}
