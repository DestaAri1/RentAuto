import React from "react";
import { NavItemProps } from "../../../../types";
import { NavLink } from "react-router-dom";

export default function NavItem({ navItem }: NavItemProps) {
  return (
    <>
      {navItem.map((item) => (
        <NavLink
          key={item.title}
          to={item.href}
          end={item.href === "/dashboard"}
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-base md:text-sm font-medium rounded-md ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={`mr-3 h-6 w-6 ${
                  isActive
                    ? "text-blue-700"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              {item.title}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}
