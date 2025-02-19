'use client';

import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import { Skeleton } from '@otp0/components/ui/skeleton';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@otp0/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@otp0/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@otp0/components/ui/sidebar';

export function NavUser({
  user,
  isSignedIn,
  isLoading,
}: {
  user: any;
  isSignedIn: boolean;
  isLoading: boolean;
}) {
  const { isMobile } = useSidebar();

  const userFullName = user?.fullName || 'Guest';
  const userImageUrl = user?.imageUrl || '';
  const userEmail =
    user?.emailAddresses?.[0]?.emailAddress || 'No email available';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ) : isSignedIn ? (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userImageUrl} alt={userFullName} />
                    <AvatarFallback className="rounded-lg">
                      {userFullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userFullName}</span>
                    <span className="truncate text-xs">{userEmail}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              ) : (
                <span className="text-sm text-gray-500">Sign in</span>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ) : (
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userImageUrl} alt={userFullName} />
                      <AvatarFallback className="rounded-lg">
                        {userFullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userFullName}</span>
                      <span className="truncate text-xs">{userEmail}</span>
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
