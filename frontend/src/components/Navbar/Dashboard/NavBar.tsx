import { Bell, Menu, Search } from 'lucide-react';
import React from 'react'
import { SideBarProps } from '../../../types';

interface NavBarProps extends SideBarProps {
  onSearch?: (keyword: string) => void;
}

export default function NavBar({ setSidebarOpen, onSearch }: NavBarProps) {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <div className="w-full flex md:ml-0">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                <Search className="h-5 w-5" />
              </div>
              <input
                id="search-field"
                className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search here..."
                type="search"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Bell className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <img
                  className="h-8 w-8 rounded-full"
                  src="/api/placeholder/40/40"
                  alt="User profile"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
