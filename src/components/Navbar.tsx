// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useWastra } from "../context/WastraContext";
import NavLinks from "./layouts/NavLinks";
import wastralogo from "../assets/wastralogo.svg";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useWastra();
  const [loggingOut, setLoggingOut] = useState(false);

  const UserAvatar = ({ name }: { name?: string }) => {
    const initial = name?.charAt(0).toUpperCase() || "U";
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">{initial}</span>
      </div>
    );
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={wastralogo} alt="Wastra Logo" className="h-10 w-auto" />
          </Link>

          {/* Menu (desktop) */}
          <div className="hidden md:flex space-x-6">
            <NavLinks mobile={false} />
          </div>

          {/* User section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-gray-700">{user.name || "User"}</span>
                <UserAvatar name={user.name} />
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="bg-amber-600 text-white px-4 py-1 rounded hover:bg-amber-700"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-amber-600 text-white px-4 py-1 rounded hover:bg-amber-700"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger button (mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-amber-600 focus:outline-none"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <NavLinks mobile onClick={() => setIsOpen(false)} />

            <div className="pt-3 border-t">
              {user ? (
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.name} />
                  <span className="text-gray-700">{user.name || "User"}</span>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="text-red-600 hover:text-red-800"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block bg-amber-600 text-white px-4 py-1 rounded text-center hover:bg-amber-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
