import DashboardLayout from "../../../layout/DashboardLayout.tsx";
import {
  HeaderFormCarChild,
  ParentFormCarChild,
} from "../../../components/Dashboard/Cars/CarChild/CarChildProps.tsx";
import FormCarChild from "../../../components/Dashboard/Cars/CarChild/FormCarChild.tsx";
import { useEffect } from "react";
import { useCarParent } from "../../../context/CarParentContext.tsx";

export default function AddCarChild() {
  const parent = useCarParent()
  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: parent?.title ?? "Car", href: parent?.route },
    { name: "Create Car Child", current: true },
  ];

  useEffect(() => {
    if (parent === null) {
      document.location.href = "/dashboard/my-rentals";
    }
  }, [parent]);
  return (
    <DashboardLayout breadcrumb={breadcrumbItems} title="Add Car">
      <ParentFormCarChild>
        <HeaderFormCarChild title="Add New Car Listing" />
        <FormCarChild />
      </ParentFormCarChild>
    </DashboardLayout>
  );
}
