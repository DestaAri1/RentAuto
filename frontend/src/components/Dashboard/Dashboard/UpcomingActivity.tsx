import React from "react";

export default function UpcomingActivity() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Upcoming Activity
        </h3>
      </div>
      <div className="p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute inset-0 flex items-center justify-center h-full w-6">
            <div className="h-full w-0.5 bg-gray-200"></div>
          </div>

          <ul className="relative space-y-6">
            <li className="flex items-start">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 z-10">
                <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
              </div>
              <div className="ml-4 bg-blue-50 rounded-lg p-4 shadow-sm w-full">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium text-blue-800">
                    Car Return
                  </h4>
                  <span className="text-xs text-blue-700">Today, 5:00 PM</span>
                </div>
                <p className="text-sm text-blue-700">
                  Return Tesla Model 3 to Downtown Location
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 z-10">
                <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
              </div>
              <div className="ml-4 bg-gray-50 rounded-lg p-4 shadow-sm w-full">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium text-gray-800">
                    Car Pickup
                  </h4>
                  <span className="text-xs text-gray-700">
                    Apr 30, 10:00 AM
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Pickup Audi Q7 from Airport Location
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 z-10">
                <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
              </div>
              <div className="ml-4 bg-gray-50 rounded-lg p-4 shadow-sm w-full">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium text-gray-800">
                    Reserved Vehicle Service
                  </h4>
                  <span className="text-xs text-gray-700">May 5, 2:00 PM</span>
                </div>
                <p className="text-sm text-gray-700">
                  Vehicle service appointment scheduled
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
