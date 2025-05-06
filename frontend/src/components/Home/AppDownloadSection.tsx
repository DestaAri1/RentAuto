import React from "react";
import { motion } from "framer-motion";
import { HomePageProps } from "../../types";

export default function AppDownloadSection({isVisible}: HomePageProps) {
  return (
    <section className="bg-gray-100 py-16" id="app-section">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={
              isVisible && isVisible["app-section"]
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -50 }
            }
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Download Our Mobile App
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Get exclusive deals and manage your bookings on the go with our
              mobile app. Available for iOS and Android devices.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                className="bg-black text-white px-6 py-3 rounded-lg inline-flex items-center"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-3">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"></path>
                    <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
                  </svg>
                </span>
                <span>
                  <span className="block text-xs">Download on the</span>
                  <span className="block text-lg font-semibold">App Store</span>
                </span>
              </motion.button>
              <motion.button
                className="bg-black text-white px-6 py-3 rounded-lg inline-flex items-center"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-3">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="3 3 21 12 3 21 3 3"></polygon>
                  </svg>
                </span>
                <span>
                  <span className="block text-xs">GET IT ON</span>
                  <span className="block text-lg font-semibold">
                    Google Play
                  </span>
                </span>
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={
              isVisible && isVisible["app-section"]
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: 50 }
            }
            transition={{ duration: 0.7 }}
          >
            <motion.img
              src="/api/placeholder/400/600"
              alt="Mobile App"
              className="max-h-96"
              whileHover={{ y: -10, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
