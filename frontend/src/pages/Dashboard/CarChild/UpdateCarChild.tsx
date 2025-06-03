import React, { useEffect, useMemo } from "react";
import {
  CarParentProvider,
  useCarParent,
} from "../../../context/CarParentContext.tsx";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../layout/DashboardLayout.tsx";
import {
  HeaderFormCarChild,
  ParentFormCarChild,
} from "../../../components/Dashboard/Cars/CarChild/CarChildProps.tsx";
import FormCarChild from "../../../components/Dashboard/Cars/CarChild/FormCarChild.tsx";
import useCarChild from "../../../hooks/useCarChild.tsx";
import { CarChildFormData } from "../../../types/form.tsx";

function UpdateCarChildContent() {
  const { parent, isLoading } = useCarParent();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { fetchCarChild, carChild, isFetched } = useCarChild();

  useEffect(() => {
    if (slug && !isFetched.current) {
      fetchCarChild({ slug, mode: "one" });
    }
  }, [slug, fetchCarChild, isFetched]);

  useEffect(() => {
    if (!isLoading && !parent) {
      navigate("/dashboard/my-rentals");
    }
  }, [parent, isLoading, navigate]);

  // Transform carChild data for form
  const initialData = useMemo((): Partial<CarChildFormData> => {
    if (!carChild) return {};

    return {
      name: carChild.name || "",
      alias: carChild.alias || "",
      color: carChild.color || "",
      status: carChild.status || 0,
      description: carChild.description || "",
      car_parent: parent?.title || "",
      imageUrl: "http://localhost:3000/assets/car/"+carChild.image_url, // Existing image URL
      id: carChild.id, // Car child ID for update
    };
  }, [carChild, parent]);

  console.log(carChild);
  

  if (!parent) {
    return null;
  }

  if (!carChild) {
    return (
      <DashboardLayout breadcrumb={[]} title="Loading...">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading car data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: parent.title, href: parent.route },
    { name: `Edit ${carChild.name}`, current: true },
  ];

  return (
    <DashboardLayout breadcrumb={breadcrumbItems} title="Edit Car">
      <ParentFormCarChild>
        <HeaderFormCarChild title="Update Car Listing" />
        <FormCarChild
          mode="update"
          initialData={initialData}
          carChildId={carChild.id}
        />
      </ParentFormCarChild>
    </DashboardLayout>
  );
}

export default function UpdateCarChild() {
  return (
    <CarParentProvider>
      <UpdateCarChildContent />
    </CarParentProvider>
  );
}
