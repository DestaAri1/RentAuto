import { X } from "lucide-react";
import React from "react";
import { NavItemProps, SideBarProps } from "../../../../types";
import Title from "./Title.tsx";
import User from "../User.tsx";
import NavItem from "./NavItem.tsx";

type MobileProps = SideBarProps & NavItemProps;

export default function Mobile({
  sidebarOpen,
  setSidebarOpen,
  navItem,
}: MobileProps) {
  return (
    <div
      className={`fixed inset-0 flex z-40 md:hidden ${
        sidebarOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75"
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <Title />
          <nav className="mt-5 px-2 space-y-1">
            <NavItem navItem={navItem} />
          </nav>
        </div>
        <User />
      </div>
    </div>
  );
}
