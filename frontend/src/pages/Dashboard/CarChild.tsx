import DashboardLayout from "../../layout/DashboardLayout.tsx";
import CarChildList from "../../components/Dashboard/Cars/CarChild/CarChildList.tsx";
import { getLocalStorage } from "../../services/TokenServices.tsx";
import { Link } from "react-router-dom";

export default function CarChild() {
  const parent = getLocalStorage("car_parent");

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: parent?.title ?? "Car", current: true },
  ];

  return (
    <DashboardLayout
      title="My Rentals"
      breadcrumb={breadcrumbItems}
      actionButton={
        <Link
          to={"/dashboard/my-rentals/add-car"}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Car
        </Link>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <CarChildList />
      </div>
    </DashboardLayout>
  );
}
