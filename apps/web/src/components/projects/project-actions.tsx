'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { DeleteProjectButton } from './delete-project-button';

interface ProjectActionsProps {
  spaceId: string;
  contentId: string;
  projectTitle: string;
}

export function ProjectActions({ spaceId, contentId, projectTitle }: ProjectActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute right-2 top-2 h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          asChild
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
        >
          <DeleteProjectButton
            spaceId={spaceId}
            contentId={contentId}
            projectTitle={projectTitle}
            variant="menu-item"
            onOpenChange={(open) => {
              if (!open) setIsOpen(false);
            }}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
