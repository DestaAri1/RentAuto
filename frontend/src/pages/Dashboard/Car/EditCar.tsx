import React from "react";
import DashboardLayout from "../../../layout/DashboardLayout.tsx";
import useGetCar from "../../../hooks/Car/useGetCar.tsx";

export default function EditCar() {
  const { car, isLoading } = useGetCar();

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: car ? `${car.name}` : "", current: true },
  ];

  return (
    <DashboardLayout breadcrumb={breadcrumbItems} title="Edit Car">
      {isLoading ? (
        <div>Loading car data...</div>
      ) : car ? (
        <div>
          <h2>Car Data Loaded</h2>
          <pre>{JSON.stringify(car, null, 2)}</pre>
        </div>
      ) : (
        <div>No car data found. Please check if the ID is correct.</div>
      )}
    </DashboardLayout>
  );
}
