import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden w-full">
          <Header />
          <div className="flex-1 scrollbar-hide w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
