import React from "react";
import { Car, Users, Calendar, CreditCard } from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout.tsx";
import RentBooking from "../../components/Dashboard/Dashboard/RentBooking.tsx";
import AvailableCars from "../../components/Dashboard/Dashboard/AvailableCars.tsx";
import { DashBoxes } from "../../components/DashboardComponents.tsx";
import UpcomingActivity from "../../components/Dashboard/Dashboard/UpcomingActivity.tsx";
import QuickActions from "../../components/Dashboard/Dashboard/QuickActions.tsx";
import Stats from "../../components/Dashboard/Dashboard/Stats.tsx";

// Sample data for dashboard
const recentBookings = [
  {
    id: "B1234",
    car: "Tesla Model 3",
    date: "2025-04-24",
    duration: "3 days",
    status: "Active",
    amount: 300,
  },
  {
    id: "B1235",
    car: "BMW X5",
    date: "2025-04-20",
    duration: "5 days",
    status: "Completed",
    amount: 750,
  },
  {
    id: "B1236",
    car: "Mercedes C-Class",
    date: "2025-04-15",
    duration: "2 days",
    status: "Completed",
    amount: 260,
  },
  {
    id: "B1237",
    car: "Audi Q7",
    date: "2025-05-01",
    duration: "7 days",
    status: "Upcoming",
    amount: 1190,
  },
];

const availableCars = [
  {
    id: 1,
    name: "Tesla Model 3",
    type: "Electric",
    availability: "87%",
    price: 100,
  },
  { id: 2, name: "BMW X5", type: "SUV", availability: "65%", price: 150 },
  {
    id: 3,
    name: "Toyota Camry",
    type: "Sedan",
    availability: "92%",
    price: 80,
  },
  {
    id: 4,
    name: "Porsche 911",
    type: "Sports",
    availability: "45%",
    price: 250,
  },
  { id: 5, name: "Audi Q7", type: "SUV", availability: "78%", price: 170 },
];

const rentalStats = [
  { label: "Total Bookings", value: "182", change: "+12%", icon: Calendar },
  { label: "Active Rentals", value: "24", change: "+5%", icon: Car },
  { label: "Total Revenue", value: "$8,942", change: "+18%", icon: CreditCard },
  { label: "Customer Ratings", value: "4.8/5", change: "+0.2", icon: Users },
];


const Dashboard: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      breadcrumb={breadcrumbItems}
      actionButton={
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Rent a Car
        </button>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <Stats rentalStats={rentalStats} />

        {/* Recent Bookings */}
        <RentBooking
          getStatusColor={getStatusColor}
          recentBookings={recentBookings}
        />

        {/* Available Cars */}
        <DashBoxes>
          <AvailableCars availableCars={availableCars} />
          <UpcomingActivity />
        </DashBoxes>

        <QuickActions />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
