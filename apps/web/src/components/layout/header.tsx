import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  return (
    <header className="flex items-center shrink-0 p-3 w-full justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger variant="ghost" />
        <Separator orientation="vertical" className="h-6" />
      </div>
      <ThemeToggle />
    </header>
  );
}
