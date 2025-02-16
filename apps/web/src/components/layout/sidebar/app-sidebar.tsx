'use client';

import { LogoIcon } from '@/components/icons/logo-icon';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSpaceStore } from '@/store/space-store';
import { CalendarFold, Cog, File, FileText, Home, Images } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavUser } from './nav-user';

function useNavigationItems() {
  const { currentSpace } = useSpaceStore();
  const pathname = usePathname();
  if (!currentSpace) return [];

  const baseUrl = `/dashboard/${currentSpace.id}`;

  return [
    {
      title: 'Home',
      url: baseUrl,
      icon: Home,
      isActive: pathname === baseUrl,
    },
    {
      title: 'Projects',
      url: `${baseUrl}/projects`,
      icon: File,
      isActive: pathname === `${baseUrl}/projects`,
    },
    {
      title: 'Blogposts',
      url: `${baseUrl}/blogposts`,
      icon: FileText,
      isActive: pathname === `${baseUrl}/blogposts`,
    },
    {
      title: 'Events',
      url: `${baseUrl}/events`,
      icon: CalendarFold,
      isActive: pathname === `${baseUrl}/events`,
    },
    {
      title: 'Media',
      url: `${baseUrl}/media`,
      icon: Images,
      isActive: pathname === `${baseUrl}/media`,
    },
    {
      title: 'Settings',
      url: `${baseUrl}/settings`,
      icon: Cog,
      isActive: pathname === `${baseUrl}/settings`,
    },
  ];
}

export function AppSidebar() {
  const items = useNavigationItems();

  return (
    <Sidebar collapsible="icon" className="border-r border-dashed border-border">
      <SidebarHeader>
        <SidebarMenuItem className="flex p-3">
          <Link href="/dashboard">
            <LogoIcon className="h-6 w-6 text-primary" />
          </Link>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={{
                      children: item.title,
                      side: 'right',
                    }}
                  >
                    <Link href={item.url} prefetch>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
