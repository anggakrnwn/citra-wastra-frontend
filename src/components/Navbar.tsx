import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWastra } from "../context/WastraContext";
import NavLinks from "./layouts/NavLinks";
import wastralogo from "../assets/wastralogo.svg";
import { toast } from "react-hot-toast";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useWastra();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const UserAvatar = ({ name }: { name?: string }) => {
    const initial = name?.charAt(0).toUpperCase() || "U";
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">{initial}</span>
      </div>
    );
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("You have been logged out successfully");
      setTimeout(() => navigate("/"), 1000);
    } finally {
      setLoggingOut(false);
      setShowConfirm(false);
      setIsOpen(false);
    }
  };

  return (
    <>
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

            {/* User section (desktop only) */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-gray-700">{user.name || "User"}</span>
                  <UserAvatar name={user.name} />
                  <button
                    onClick={() => setShowConfirm(true)}
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
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 z-40 transform transition-all duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute right-0 top-0 w-3/4 max-w-xs h-full bg-white shadow-xl rounded-l-2xl p-4 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu items */}
            <NavLinks mobile onClick={() => setIsOpen(false)} />

            {/* User section (mobile only) */}
            <div className="mt-4 pt-4 border-t">
              {user ? (
                <div className="bg-gray-50 rounded-xl p-3 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} />
                    <p className="font-semibold text-gray-800">{user.name}</p>
                  </div>
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={loggingOut}
                    className="text-red-600 text-sm font-medium hover:bg-red-100 rounded-md px-2 py-1 w-fit transition-colors"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg text-center hover:bg-amber-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Confirm Logout Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to log out
              {user?.name ? `, ${user.name}` : ""}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loggingOut}
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={loggingOut}
                className="px-4 py-1 rounded bg-amber-600 text-white hover:bg-amber-700"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
