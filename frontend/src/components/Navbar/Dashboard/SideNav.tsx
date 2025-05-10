import React from "react";
import { SideNavHeader } from "../../DashboardComponents.tsx";
import Title from "./SideNav/Title.tsx";
import Dekstop from "./SideNav/Dekstop.tsx";
import {
  BarChart,
  Calendar,
  Car,
  FileText,
  HelpCircle,
  Map,
  Settings,
} from "lucide-react";
import Mobile from "./SideNav/Mobile.tsx";
import { SideBarProps } from "../../../types/index.tsx";
import User from "./User.tsx";

export default function SideNav({ sidebarOpen, setSidebarOpen }: SideBarProps) {
  const navItem = [
    { title: "Dashboard", href: "/dashboard", icon: BarChart },
    { title: "My Rentals", href: "/dashboard/my-rentals", icon: Car },
    { title: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { title: "Locations", href: "/locations", icon: Map },
    { title: "Invoices", href: "/invoices", icon: FileText },
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
        <Dekstop navItem={navItem} />
        <User/>
      </SideNavHeader>
    </>
  );
}
