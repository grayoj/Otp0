'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@otp0/components/ui/breadcrumb';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@otp0/components/ui/sidebar';
import { AppSidebar } from '@otp0/components/app-sidebar';
import { Separator } from '@radix-ui/react-separator';
import { useProject } from '@otp0/hooks/useProject';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const projectId =
    pathSegments.length >= 3 && pathSegments[1] === 'projects'
      ? pathSegments[2]
      : '';
  const { data: project } = useProject(projectId);
  const projectName = project?.name || null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                {pathSegments.length > 0 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
              {pathSegments.map((segment, index) => {
                const href = '/' + pathSegments.slice(0, index + 1).join('/');
                const isLast = index === pathSegments.length - 1;
                let label = segment.replace(/-/g, ' ');
                if (
                  index === 2 &&
                  pathSegments[1] === 'projects' &&
                  projectName
                ) {
                  label = projectName;
                }
                return (
                  <BreadcrumbItem key={href}>
                    <BreadcrumbLink href={href} className="capitalize">
                      {label}
                    </BreadcrumbLink>
                    {!isLast && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
