'use client';

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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteProject } from '@/lib/actions/delete/delete-project';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteProjectButtonProps {
  spaceId: string;
  contentId: string;
  projectTitle: string;
  variant?: 'button' | 'menu-item';
  onOpenChange?: (open: boolean) => void;
}

export function DeleteProjectButton({
  spaceId,
  contentId,
  projectTitle,
  variant = 'button',
  onOpenChange,
}: DeleteProjectButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const result = await deleteProject(spaceId, contentId);

      if (!result.success) {
        toast.error(result.error || 'Failed to delete project');
        setIsDeleting(false);
        return;
      }

      toast.success('Project deleted successfully');
      router.push(`/dashboard/${spaceId}/projects`);
    } catch (error) {
      console.error('Client-side error deleting project:', error);
      toast.error('Failed to delete project');
      setIsDeleting(false);
    }
  }

  const Trigger =
    variant === 'button' ? (
      <Button variant="destructive" size="sm">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Project
      </Button>
    ) : (
      <Button
        variant="ghost"
        className="w-full justify-start px-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    );

  return (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{Trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{projectTitle}&quot; and all its associated content.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Project'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
