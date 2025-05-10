import React from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableHead, Td, Th } from "../../Table.tsx";

interface RecentBookings {
  id: string;
  car: string;
  date: string;
  duration: string;
  status: string;
  amount: number;
}

interface RentBookingProps {
  recentBookings: RecentBookings[];
  getStatusColor: (value: string) => void;
}

export default function RentBooking({
  recentBookings,
  getStatusColor,
}: RentBookingProps) {
  return (
    <div className="mt-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Bookings
          </h3>
          <Link
            to="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="py-2 align-middle inline-block min-w-full">
              <Table>
                <TableHead>
                  <tr>
                    <Th>Booking Id</Th>
                    <Th>Car</Th>
                    <Th>Date</Th>
                    <Th>Duration</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                    <Th className="relative">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </TableHead>
                <TableBody>
                  {recentBookings.slice(0, 4).map((booking) => (
                    <tr key={booking.id}>
                      <Td className="font-medium text-gray-900">
                        {booking.id}
                      </Td>
                      <Td>{booking.car}</Td>
                      <Td>{booking.date}</Td>
                      <Td>{booking.duration}</Td>
                      <Td>{booking.amount}</Td>
                      <Td className="">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </Td>
                      <Td className="text-right text-sm font-medium">
                        <Link
                          to="#"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Details
                        </Link>
                      </Td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
