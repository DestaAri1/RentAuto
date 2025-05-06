import React from 'react'
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion'
import { HomePageProps } from '../../types';

export default function CTASection({isVisible}: HomePageProps) {
  return (
    <section className="container mx-auto py-16 px-4" id="cta-section">
      <motion.div
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={
          isVisible && isVisible["cta-section"]
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 50 }
        }
        transition={{ duration: 0.7 }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={
            isVisible && isVisible["cta-section"]
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -20 }
          }
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Ready to Hit the Road?
        </motion.h2>
        <motion.p
          className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={
            isVisible && isVisible["cta-section"]
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Join thousands of satisfied customers who trust RentAuto for their
          travel needs. Book your perfect car today and enjoy the journey!
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isVisible && isVisible["cta-section"]
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/rent"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex items-center justify-center"
            >
              Book a Car Now
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-medium rounded-lg inline-flex items-center justify-center transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
