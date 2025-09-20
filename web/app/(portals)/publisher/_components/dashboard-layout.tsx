import { SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';
import { ReactNode } from 'react';
import { AppSidebar } from './app-sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export { DashboardLayout };
