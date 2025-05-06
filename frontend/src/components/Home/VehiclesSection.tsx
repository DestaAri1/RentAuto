import React from 'react'
import {motion } from 'framer-motion'
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { HomePageProps } from '../../types';

export default function VehiclesSection({variants, cars, insideVariants, isVisible}: HomePageProps) {
  return (
    <section className="container mx-auto py-16 px-4" id="featured-cars">
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0 }}
        animate={
          isVisible && isVisible["featured-cars"]
            ? { opacity: 1 }
            : { opacity: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-800">Featured Vehicles</h2>
        <Link
          to="/rent"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          View All Cars
          <ChevronRight size={18} className="ml-1" />
        </Link>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
        variants={variants}
        initial="hidden"
        animate={isVisible && isVisible["featured-cars"] ? "visible" : "hidden"}
      >
        {cars &&
          cars.slice(0,5).map((car, index) => (
            <motion.div
              key={car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              variants={insideVariants}
              custom={index}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-56 object-cover"
                />
                <motion.div
                  className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  ${car.price}/day
                </motion.div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {car.name}
                  </h3>
                  <div className="flex items-center">
                    <Star
                      className="text-yellow-500 fill-yellow-500"
                      size={16}
                    />
                    <span className="ml-1 text-sm font-medium">
                      {car.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-6">
                  <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                    {car.type}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {car.seats} Seats
                  </span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={`/car/${car.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
                  >
                    View Details
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
      </motion.div>
    </section>
  );
}
