import { ReactNode } from "react";
import { DashBoxTitle } from "../../../DashboardComponents.tsx";

interface ChildProps {
    children: ReactNode;
}

const ParentCarChildList = ({children}: ChildProps) => {
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
}

export {ParentCarChildList}
