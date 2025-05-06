import { Car } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const QuickLinksItem = [
  {
    name: "Home",
    link: "#",
  },
  {
    name: "Fleet",
    link: "#",
  },
  {
    name: "Locations",
    link: "#",
  },
  {
    name: "About Us",
    link: "#",
  },
];

const SupportItem = [
  {
    name: "FAQs",
    link: "#",
  },
  {
    name: "Contact Us",
    link: "#",
  },
  {
    name: "Terms & Conditions",
    link: "#",
  },
  {
    name: "Privacy Policy",
    link: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car size={24} />
              <span className="text-xl font-bold">RentAuto</span>
            </div>
            <p className="text-gray-400">
              Premium car rental service for all your travel needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {QuickLinksItem.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-gray-400 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {SupportItem.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-gray-400 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="not-italic text-gray-400">
              <p>123 Main Street</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">Email: contact@rentauto.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} RentAuto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
