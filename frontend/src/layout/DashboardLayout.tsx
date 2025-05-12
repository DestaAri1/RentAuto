import { PropsWithChildren, useState } from "react";
import {
  Breadcrumb,
  DashboardMain,
  DashMainContent,
} from "../components/DashboardComponents.tsx";
import SideNav from "../components/Navbar/Dashboard/SideNav.tsx";
import NavBar from "../components/Navbar/Dashboard/NavBar.tsx";
import { BreadcrumbProps } from "../types/index.tsx";
import { Helmet } from "react-helmet-async";

interface DashboardLayoutProps {
  onSearch?: (keyword: string) => void;
  title: string;
}

type PageProps = PropsWithChildren;

type CombinedProps = DashboardLayoutProps & BreadcrumbProps & PageProps;

const DashboardLayout = ({
  children,
  breadcrumb,
  actionButton,
  onSearch,
  title,
}: CombinedProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardMain>
      <Helmet>
        <title>{title} - RentAuto</title>
      </Helmet>
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
};

DashboardLayout.displayName = "DashboardLayout";

export default DashboardLayout;
