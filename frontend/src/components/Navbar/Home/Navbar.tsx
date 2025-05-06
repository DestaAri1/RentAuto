import {
  Car,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.tsx";
import { AnimatePresence, motion } from "framer-motion";

const NavItem = [
  { name: "Home", link: "/" },
  { name: "Rent a Car", link: "/rent-a-car" },
  { name: "About Us", link: "/about" },
  { name: "Contact", link: "/contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close all menus when location changes
    setNavMenuOpen(false);
    setUserMenuOpen(false);
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleNavMenu = () => {
    setNavMenuOpen(!navMenuOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (navMenuOpen) setNavMenuOpen(false);
  };

  return (
    <header
      className={`w-full top-0 z-50 sticky ${
        scrolled ? "bg-white shadow-lg" : "bg-white bg-opacity-95 shadow-md"
      } transition-all duration-300`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={toggleNavMenu}
          className="flex items-center space-x-2 md:cursor-pointer"
        >
          <Car className="text-blue-600" size={24} />
          <span className="text-xl font-bold text-blue-600">RentAuto</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {NavItem.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              className={({ isActive }) =>
                `font-medium relative ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-900 hover:text-blue-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* CTA Buttons / User */}
        <div
          className="hidden md:flex items-center space-x-4 relative"
          ref={dropdownRef}
        >
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user.image || "/default-avatar.png"}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <span className="text-sm font-medium">{user.name}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50"
                  >
                    <div className="p-3 border-b">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.image || "/default-avatar.png"}
                          alt="User avatar"
                          className="w-10 h-10 rounded-full border"
                        />
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {user.role.name === "Administrator" && (
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-gray-100 transition"
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-gray-100 transition"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-gray-100 transition"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100 transition"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile User Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleUserMenu}
            className="p-2 rounded-md text-gray-700 hover:text-blue-600"
          >
            <svg width="24" height="24" fill="none">
              {userMenuOpen ? (
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu - Appears when RentAuto is clicked */}
      <AnimatePresence>
        {navMenuOpen && (
          <motion.div
            key="mobileNavMenu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-2">
              {NavItem.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.link}
                  className={({ isActive }) =>
                    `block py-3 font-medium ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-900 hover:text-blue-600"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile User Menu - Appears when hamburger icon is clicked */}
      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            key="mobileUserMenu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-2">
              {!user ? (
                <div className="flex flex-col space-y-2 my-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="py-2">
                  <div className="flex items-center space-x-3 px-2 py-4 border-b">
                    <img
                      src={user.image || "/default-avatar.png"}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full border"
                    />
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs mt-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block">
                        {user.role.name}
                      </p>
                    </div>
                  </div>
                  {user.role.name === "Administrator" && (
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-2 py-3 text-gray-900 hover:text-blue-600"
                    >
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-2 py-3 text-gray-900 hover:text-blue-600"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-2 py-3 text-gray-900 hover:text-blue-600"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 text-left px-2 py-3 text-red-600 hover:text-red-700"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
