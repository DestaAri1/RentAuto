import DashboardLayout from "../../../layout/DashboardLayout.tsx";
import {
  HeaderFormCarChild,
  ParentFormCarChild,
} from "../../../components/Dashboard/Cars/CarChild/CarChildProps.tsx";
import FormCarChild from "../../../components/Dashboard/Cars/CarChild/FormCarChild.tsx";
import { useEffect } from "react";
import {
  CarParentProvider,
  useCarParent,
} from "../../../context/CarParentContext.tsx";
import { useNavigate } from "react-router-dom";

function AddCarChildContent() {
  const { parent, isLoading } = useCarParent();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Tunggu loading selesai baru redirect
    if (!isLoading && !parent) {
      console.log("No parent data found, redirecting...");
      navigate("/dashboard/my-rentals");
    }
  }, [parent, isLoading, navigate]);

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: parent?.title ?? "Car", href: parent?.route },
    { name: "Create Car Child", current: true },
  ];

  return (
    <DashboardLayout breadcrumb={breadcrumbItems} title="Add Car">
      <ParentFormCarChild>
        <HeaderFormCarChild title="Add New Car Listing" />
        <FormCarChild />
      </ParentFormCarChild>
    </DashboardLayout>
  );
}

export default function AddCarChild() {
  return (
    <CarParentProvider>
      <AddCarChildContent />
    </CarParentProvider>
  );
}
