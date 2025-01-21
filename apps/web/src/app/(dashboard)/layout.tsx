import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full">
        <div className="border border-red-500 w-full flex items-center">
          <SidebarTrigger />
          <div>here comes the header</div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
