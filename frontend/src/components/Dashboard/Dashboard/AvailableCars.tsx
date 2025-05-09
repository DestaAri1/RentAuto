import { Car } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { AvailableCarsProps } from "../../../types";

export default function AvailableCars({ availableCars }: AvailableCarsProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Available Cars
        </h3>
        <Link
          to="#"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all
        </Link>
      </div>
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          {availableCars.map((car) => (
            <li key={car.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-md p-2 mr-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {car.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {car.type} • ${car.price}/day
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-green-600 font-medium mr-4">
                  {car.availability} available
                </span>
                <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                  Book Now
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
