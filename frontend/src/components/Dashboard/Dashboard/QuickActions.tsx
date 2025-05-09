import { Calendar, Car, FileText, HelpCircle, Map, Settings } from 'lucide-react';
import React from 'react'

export default function QuickActions() {
  return (
    <div className="mt-8 mb-8">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <Car className="mx-auto h-6 w-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">New Rental</span>
        </button>
        <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <Calendar className="mx-auto h-6 w-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">
            Reservations
          </span>
        </button>
        <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <FileText className="mx-auto h-6 w-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Invoice</span>
        </button>
        <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <Map className="mx-auto h-6 w-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Locations</span>
        </button>
        <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <HelpCircle className="mx-auto h-6 w-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Support</span>
        </button>
        <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
          <Settings className="mx-auto h-6 w-6 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Settings</span>
        </button>
      </div>
    </div>
  );
}
