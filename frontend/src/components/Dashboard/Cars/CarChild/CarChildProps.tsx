import React, { ReactNode } from "react";

interface ChildProps {
    children: ReactNode;
}

const ParentCarChildList = ({children}: ChildProps) => {
  return (
    <div className="mt-8">
      <div className="bg-white shadow rounded-lg">
        {children}
      </div>
    </div>
  );
}

export {ParentCarChildList}
