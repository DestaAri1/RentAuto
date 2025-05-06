import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

export default function SearchSection() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would navigate to search results
    console.log({ pickupLocation, pickupDate, returnDate });
  };
  return (
    <section
      className="container mx-auto px-4 -mt-24 relative z-10"
      id="search-section"
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Find Your Perfect Rental Car
        </h2>
        <form onSubmit={handleSearch}>
          <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-4">
            <motion.div
              className="w-full lg:w-1/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Pick-up Location
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Enter city or airport"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </div>
            </motion.div>
            <motion.div
              className="w-full lg:w-1/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Pick-up Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
            </motion.div>
            <motion.div
              className="w-full lg:w-1/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Return Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
          <motion.button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Search Available Cars
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
