import { ChevronRight, Clock, Phone, Shield, Truck } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion'
import { HomePageProps } from '../../types';

export default function BenefitsSection({isVisible, variants, insideVariants}: HomePageProps) {
  return (
    <section className="bg-blue-600 py-16 text-white" id="benefits">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isVisible && isVisible["benefits"]
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5 }}
        >
          Why Choose RentAuto
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={variants}
          initial="hidden"
          animate={isVisible && isVisible["benefits"] ? "visible" : "hidden"}
        >
          {[
            {
              icon: Shield,
              title: "100% Secure Booking",
              text: "Your data is protected with industry-standard encryption.",
            },
            {
              icon: Truck,
              title: "Free Delivery",
              text: "Free car delivery to your location within city limits.",
            },
            {
              icon: Clock,
              title: "24/7 Support",
              text: "Our customer service team is available around the clock.",
            },
            {
              icon: Phone,
              title: "Easy Cancellation",
              text: "Cancel or modify your booking with no hidden fees.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={insideVariants}
              custom={index}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 mb-4"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <item.icon size={32} />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-blue-100">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isVisible && isVisible["benefits"]
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/about"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 font-medium rounded-lg"
          >
            Learn More About Us
            <ChevronRight size={18} className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
