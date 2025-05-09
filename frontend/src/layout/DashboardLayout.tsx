import React, { ReactNode, useState } from 'react'
import { Breadcrumb, DashboardMain, DashMainContent } from '../components/DashboardComponents.tsx'
import SideNav from '../components/Navbar/Dashboard/SideNav.tsx'
import NavBar from '../components/Navbar/Dashboard/NavBar.tsx';
import { BreadcrumbProps } from '../types/index.tsx';

interface DashboardLayoutProps {
  children: ReactNode;
  onSearch?: (keyword: string) => void;
}

type CombinedProps = DashboardLayoutProps & BreadcrumbProps;

export default function DashboardLayout({children, breadcrumb, actionButton, onSearch}: CombinedProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <DashboardMain>
      <SideNav setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <DashMainContent>
        <NavBar setSidebarOpen={setSidebarOpen} onSearch={onSearch} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          <div className="py-6">
            <Breadcrumb breadcrumb={breadcrumb} actionButton={actionButton} />
            {children}
          </div>
        </main>
      </DashMainContent>
    </DashboardMain>
  );
}
