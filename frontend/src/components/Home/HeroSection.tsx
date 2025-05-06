import React from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import {ChevronRight} from 'lucide-react'

export default function HeroSection() {
  return (
    <section
      className="relative h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/api/placeholder/1920/1080')" }}
      id="hero-section"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative container mx-auto h-full flex items-center px-4">
        <motion.div
          className="max-w-3xl text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Drive Your Way, <br />
            On Your Terms
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-gray-200"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Experience the freedom of the open road with our premium car rental
            service. Choose from our extensive fleet for any occasion.
          </motion.p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/rent"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex items-center"
              >
                Browse Cars
                <ChevronRight size={18} className="ml-2" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white font-medium rounded-lg transition-colors">
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
