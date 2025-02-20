'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useHeaderStore } from '@/store/header-store';
import { AnimatePresence, motion } from 'motion/react';

export function Header() {
  const title = useHeaderStore((state) => state.title);
  const button = useHeaderStore((state) => state.button);

  return (
    <header className="flex items-center shrink-0 p-3 w-full justify-between border-b border-dashed border-border">
      <div className="flex items-center gap-2">
        <SidebarTrigger variant="ghost" />
        <Separator orientation="vertical" className="h-6" />
      </div>
      <AnimatePresence mode="wait">
        {title && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <h1 className="text-sm font-semibold">{title}</h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {button?.isVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {button.component}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
