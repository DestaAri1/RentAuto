import React from "react";
import { SideNavHeader } from "../../DashboardComponents.tsx";
import Title from "./SideNav/Title.tsx";
import {
  BarChart,
  Calendar,
  Car,
  FileText,
  HelpCircle,
  Map,
  Settings,
  User,
  Users,
  Shield,
} from "lucide-react";
import Mobile from "./SideNav/Mobile.tsx";
import { SideBarProps } from "../../../types/index.tsx";
import Desktop from "./SideNav/Dekstop.tsx";

export default function SideNav({ sidebarOpen, setSidebarOpen }: SideBarProps) {
  const navItem = [
    { title: "Dashboard", href: "/dashboard", icon: BarChart },
    { title: "My Rentals", href: "/dashboard/my-rentals", icon: Car },
    { title: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { title: "Locations", href: "/locations", icon: Map },
    { title: "Invoices", href: "/invoices", icon: FileText },
    {
      title: "User Management",
      icon: User,
      isDropdown: true,
      subItems: [
        { title: "Users", href: "/dashboard/users", icon: Users },
        { title: "Roles", href: "/dashboard/roles", icon: Shield },
      ],
    },
    { title: "Settings", href: "/settings", icon: Settings },
    { title: "Help & Support", href: "/help", icon: HelpCircle },
  ];

  return (
    <>
      {sidebarOpen && (
        <Mobile
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navItem={navItem}
        />
      )}
      <SideNavHeader>
        <Title />
        <Desktop navItem={navItem} />
      </SideNavHeader>
    </>
  );
}
