'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@otp0/hooks/useAuth';
import {
  KeySquareIcon,
  FolderCodeIcon,
  Settings2,
  TerminalIcon,
  Lock,
} from 'lucide-react';

import { NavUser } from '@otp0/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@otp0/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isSignedIn, isLoading } = useAuth();
  const pathname = usePathname();

  const navMain = [
    { title: 'Dashboard', url: '/dashboard', icon: TerminalIcon },
    { title: 'Projects', url: '/dashboard/projects', icon: FolderCodeIcon },
    { title: 'Keys', url: '/dashboard/keys', icon: KeySquareIcon },
    { title: 'Settings', url: '/dashboard/settings', icon: Settings2 },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Lock className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Otp0</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navMain.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' // Active state
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <a href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isSignedIn={isSignedIn} isLoading={isLoading} />
      </SidebarFooter>
    </Sidebar>
  );
}
