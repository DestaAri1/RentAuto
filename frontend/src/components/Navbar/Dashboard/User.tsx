import React from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.tsx';

export default function User() {
  const {user} = useAuth()
  return (
    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
      <Link to="#" className="flex-shrink-0 w-full group block">
        <div className="flex items-center">
          <div>
            <img
              className="inline-block h-9 w-9 rounded-full"
              src="/api/placeholder/40/40"
              alt="Profile"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {user?.name}
            </p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              View profile
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
