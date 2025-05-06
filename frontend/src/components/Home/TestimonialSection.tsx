import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { HomePageProps } from "../../types";

export default function TestimonialSection({
  isVisible,
  testimonials,
}: HomePageProps) {
  // Manage testimonial state internally since it's not part of HomePageProps
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!testimonials) return;

    const intervalId = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [testimonials]);
  // Handle the case when testimonials might be undefined
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Ensure activeTestimonial is within bounds
  const currentTestimonial = testimonials[activeTestimonial || 0];

  return (
    <section className="container mx-auto py-16 px-4" id="testimonials">
      <motion.h2
        className="text-3xl font-bold text-gray-800 text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={
          isVisible && isVisible["testimonials"]
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{ duration: 0.5 }}
      >
        What Our Customers Say
      </motion.h2>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative bg-white rounded-xl shadow-md p-8 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={
            isVisible && isVisible["testimonials"]
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <motion.img
              key={currentTestimonial.id}
              src={currentTestimonial.image}
              alt={currentTestimonial.name}
              className="w-20 h-20 rounded-full object-cover"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              key={`testimonial-${activeTestimonial}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star
                      size={20}
                      className={
                        i < currentTestimonial.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
              <motion.p
                className="text-gray-600 text-lg italic mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "{currentTestimonial.text}"
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="font-bold text-lg">{currentTestimonial.name}</h4>
                <p className="text-gray-500">{currentTestimonial.role}</p>
              </motion.div>
            </motion.div>
          </div>
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() =>
                  setActiveTestimonial && setActiveTestimonial(index)
                }
                className={`w-3 h-3 rounded-full ${
                  activeTestimonial === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.5 }}
                animate={
                  activeTestimonial === index ? { scale: 1.2 } : { scale: 1 }
                }
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
