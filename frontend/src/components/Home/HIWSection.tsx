import React from "react";
import { motion } from "framer-motion";

export default function HIWSection({variants, insideVariants, isVisible, hiw}) {
  return (
    <section className="bg-gray-100 py-16" id="how-it-works">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-gray-800 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isVisible["how-it-works"]
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={variants}
          initial="hidden"
          animate={isVisible["how-it-works"] ? "visible" : "hidden"}
        >
          {hiw && hiw.map((step, index) => (
            <motion.div
              key={step.id}
              className="bg-white p-8 rounded-xl shadow-sm text-center relative"
              variants={insideVariants}
              custom={index}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.div
                className="absolute -top-5 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg"
                initial={{ scale: 0 }}
                animate={
                  isVisible["how-it-works"] ? { scale: 1 } : { scale: 0 }
                }
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
              >
                {index + 1}
              </motion.div>
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6 mt-2"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <step.icon size={32} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
