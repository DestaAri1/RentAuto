import React from "react";
import { Outlet } from "react-router-dom";

const RouteWrapper: React.FC = () => {
  return <Outlet />;
};

export default RouteWrapper;