import DashboardLayout from "../../layout/DashboardLayout.tsx";
import CarChildList from "../../components/Dashboard/Cars/CarChild/CarChildList.tsx";
import { Link } from "react-router-dom";
import {
  CarParentProvider,
  useCarParent,
} from "../../context/CarParentContext.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PermissionWrapper } from "../../utils/PermissionWrapper.tsx";

// ✅ Komponen terpisah yang menggunakan context
function CarChildContent() {
  const { parent, isLoading } = useCarParent();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Tunggu loading selesai baru redirect
    if (!isLoading && !parent) {
      navigate("/dashboard/my-rentals");
    }
  }, [parent, isLoading, navigate]);

  if (!parent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: parent.title, current: true },
  ];

  return (
    <DashboardLayout
      title="My Rentals"
      breadcrumb={breadcrumbItems}
      actionButton={
        <PermissionWrapper permission="view_car">
          <Link
            to={`${parent.route}/create-car`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Car
          </Link>
        </PermissionWrapper>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <CarChildList route={parent.route} />
      </div>
    </DashboardLayout>
  );
}

// ✅ Komponen utama dengan Provider hanya di sini
export default function CarChild() {
  return (
    <CarParentProvider>
      <CarChildContent />
    </CarParentProvider>
  );
}
