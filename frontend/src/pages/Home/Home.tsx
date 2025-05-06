import React, { useState, useEffect } from "react";
import {
  Calendar,
  Car,
  Shield,
} from "lucide-react";
import HomeLayout from "../../layout/HomeLayout.tsx";
import HeroSection from "../../components/Home/HeroSection.tsx";
import SearchSection from "../../components/Home/SearchSection.tsx";
import VehiclesSection from "../../components/Home/VehiclesSection.tsx";
import HIWSection from "../../components/Home/HIWSection.tsx";
import TestimonialSection from "../../components/Home/TestimonialSection.tsx";
import BenefitsSection from "../../components/Home/BenefitsSection.tsx";
import CTASection from "../../components/Home/CTASection.tsx";
import AppDownloadSection from "../../components/Home/AppDownloadSection.tsx";

// Featured cars data
const featuredCars = [
  {
    id: 1,
    name: "Tesla Model 3",
    price: 100,
    image: "/api/placeholder/500/300",
    rating: 4.9,
    type: "Electric",
    seats: 5,
  },
  {
    id: 2,
    name: "BMW X5",
    price: 150,
    image: "/api/placeholder/500/300",
    rating: 4.8,
    type: "SUV",
    seats: 7,
  },
  {
    id: 3,
    name: "Mercedes-Benz C-Class",
    price: 130,
    image: "/api/placeholder/500/300",
    rating: 4.7,
    type: "Sedan",
    seats: 5,
  },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Traveler",
    image: "/api/placeholder/100/100",
    text: "RentAuto made my business trip so much easier! The booking process was simple and the car was exactly what I needed.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Family Vacation",
    image: "/api/placeholder/100/100",
    text: "We rented an SUV for our family vacation and it was perfect. Clean, spacious, and great service!",
    rating: 4,
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Weekend Getaway",
    image: "/api/placeholder/100/100",
    text: "The sports car I rented for the weekend was amazing! Will definitely be using RentAuto again for my next trip.",
    rating: 5,
  },
];

// How it works steps
const howItWorks = [
  {
    id: 1,
    title: "Choose Your Car",
    description:
      "Browse our selection of quality vehicles and choose the perfect one for your needs.",
    icon: Car,
  },
  {
    id: 2,
    title: "Select Location & Date",
    description:
      "Choose your pickup location and rental dates that work best for your schedule.",
    icon: Calendar,
  },
  {
    id: 3,
    title: "Book & Confirm",
    description:
      "Complete your booking with our secure payment system and receive instant confirmation.",
    icon: Shield,
  },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5 },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

type VisibilityMap = Record<string, boolean>;

export function Home() {
  const [isVisible, setIsVisible] = useState<VisibilityMap>({});

  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll("section[id]").forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <HomeLayout title="Home">
      <HeroSection />
      <SearchSection />
      <VehiclesSection
        variants={staggerContainer}
        insideVariants={fadeIn}
        cars={featuredCars}
        isVisible={isVisible}
      />
      <HIWSection
        variants={staggerContainer}
        insideVariants={fadeIn}
        hiw={howItWorks}
        isVisible={isVisible}
      />
      <TestimonialSection isVisible={isVisible} testimonials={testimonials} />
      <BenefitsSection
        variants={staggerContainer}
        insideVariants={fadeIn}
        isVisible={isVisible}
      />
      <CTASection isVisible={isVisible} />
      <AppDownloadSection isVisible={isVisible} />
    </HomeLayout>
  );
}
