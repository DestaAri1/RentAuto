import { useState } from "react";
import { NavItemProps } from "../../../../types";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function NavItem({ navItem }: NavItemProps) {
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      {navItem.map((item) => (
        <div key={item.title}>
          {item.isDropdown ? (
            <>
              {/* Dropdown Header */}
              <button
                onClick={() => toggleDropdown(item.title)}
                className="group flex items-center w-full px-2 py-2 text-base md:text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                <span className="flex-1 text-left">{item.title}</span>
                {openDropdowns[item.title] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Dropdown Items */}
              {openDropdowns[item.title] && item.subItems && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.title}
                      to={subItem.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <subItem.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive
                                ? "text-blue-700"
                                : "text-gray-400 group-hover:text-gray-500"
                            }`}
                          />
                          {subItem.title}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Regular Nav Item */
            <NavLink
              to={item.href!}
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
          )}
        </div>
      ))}
    </>
  );
}
