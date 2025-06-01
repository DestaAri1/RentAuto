import React, { ReactNode } from "react";
import { DashBoxTitle } from "../../../DashboardComponents.tsx";

interface ChildProps {
  children?: ReactNode;
  title?: string;
}

const ParentCarChildList = ({ children }: ChildProps) => {
  return (
    <div className="mt-8">
      <div className="bg-white shadow rounded-lg">
        <DashBoxTitle title="Car List" />
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="py-2 align-middle inline-block min-w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParentFormCarChild: React.FC<ChildProps> = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 mt-8">
        {children}
      </div>
    </div>
  );
};

const HeaderFormCarChild: React.FC<ChildProps> = ({ title }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-gray-600">
        Fill in the details below to create your car rental listing
      </p>
    </div>
  );
};

export { ParentCarChildList, ParentFormCarChild, HeaderFormCarChild };
