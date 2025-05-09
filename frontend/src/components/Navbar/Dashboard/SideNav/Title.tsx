import { Car } from 'lucide-react';
import React, { JSX } from 'react'

export default function Title(): JSX.Element {
  return (
    <div className="flex items-center flex-shrink-0 px-4">
      <div className="flex items-center space-x-2">
        <Car className="text-blue-600" size={24} />
        <span className="text-xl font-bold text-blue-600">RentAuto</span>
      </div>
    </div>
  );
}
