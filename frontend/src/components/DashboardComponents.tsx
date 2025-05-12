import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { BreadcrumbProps } from "../types";

interface DashboardComponents {
  title?: string;
}

type DashboardChildren = PropsWithChildren;

type DashboardComponentsProps = DashboardComponents & DashboardChildren;

const DashboardMain = ({ children }: DashboardChildren) => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">{children}</div>
  );
};

const SideNavHeader = ({ children }: DashboardChildren) => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashMainContent = ({ children }: DashboardChildren) => {
  return (
    <div className="flex flex-col w-0 flex-1 overflow-hidden">{children}</div>
  );
};

const DashBoxTitle = ({ children, title }: DashboardComponentsProps) => {
  return (
    <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      {children}
    </div>
  );
};

const DashBoxes = ({ children }: DashboardChildren) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">{children}</div>
  );
};

const Breadcrumb = ({ breadcrumb, actionButton }: BreadcrumbProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center">
            {breadcrumb.map((item, index) => (
              <li key={index}>
                <div className="flex items-center">
                  {index !== 0 && (
                    <svg
                      className="h-5 w-5 text-gray-400 mx-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  {item.href && !item.current ? (
                    <Link
                      to={item.href}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
        {actionButton && <div>{actionButton}</div>}
      </div>
    </div>
  );
};

export {
  DashboardMain,
  SideNavHeader,
  DashMainContent,
  Breadcrumb,
  DashBoxes,
  DashBoxTitle,
};
