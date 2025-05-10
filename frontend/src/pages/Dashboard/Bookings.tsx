import React from "react";
import DashboardLayout from "../../layout/DashboardLayout.tsx";

export default function Bookings() {
  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Bookings", href: "/dashboard/bookings" },
  ];
  return (
    <DashboardLayout title="Bookings" breadcrumb={breadcrumbItems}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">hehe</div>
    </DashboardLayout>
  );
}
