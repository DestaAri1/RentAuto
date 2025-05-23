import { Car } from "lucide-react";
import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface AuthProps {
  children: ReactNode;
}

const AuthMain = ({ children }: AuthProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const AuthTitle = () => {
  const location = useLocation();
  const currentLocation = location.pathname;

  let authTitleItem = {
    title1: "",
    title2: "",
    link: "#",
  };

  if (currentLocation === "/login") {
    authTitleItem = {
      title1: "Log In to your account",
      title2: "create a new account",
      link: "/register",
    };
  } else {
    authTitleItem = {
      title1: "Register your account",
      title2: "you already have an account?",
      link: "/login",
    };
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          <Car className="text-blue-600" size={32} />
          <span className="text-2xl font-bold text-blue-600">RentAuto</span>
        </div>
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {authTitleItem.title1}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{" "}
        <Link
          to={authTitleItem.link}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          {authTitleItem.title2}
        </Link>
      </p>
    </div>
  );
};

const AuthFormBox = ({ children }: AuthProps) => {
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {/* Masukkan form dll disini */}
        {children}
      </div>
    </div>
  );
};

const AuthAnother = ({ children }: AuthProps) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3">{children}</div>
    </div>
  );
};

const AuthGoogle = () => {
  return (
    <div>
      <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </button>
    </div>
  );
};

export { AuthMain, AuthTitle, AuthFormBox, AuthAnother, AuthGoogle };
