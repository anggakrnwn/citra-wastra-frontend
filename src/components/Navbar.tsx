import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWastra } from "../context/WastraContext";
import { useTheme } from "../context/ThemeContext";
import NavLinks from "./layouts/NavLinks";
import wastralogo from "../assets/wastralogo.svg";
import { toast } from "react-hot-toast";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { user, logout } = useWastra();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const UserAvatar = ({ name, profilePicture, email }: { name?: string | null; profilePicture?: string | null; email?: string }) => {
    if (profilePicture) {
      return (
        <img
          src={profilePicture}
          alt={name || "User"}
          className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
        />
      );
    }
    const initial = name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U";
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{initial}</span>
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
      <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full top-0 left-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <img src={wastralogo} alt="Wastra Logo" className="h-10 w-auto" />
            </Link>

            <div className="hidden md:flex space-x-6 items-center">
              <NavLinks mobile={false} userRole={user?.role} />
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                  aria-label="Theme selector"
                >
                  {resolvedTheme === "dark" ? (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>
                
                {themeMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setThemeMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                      <button
                        onClick={() => {
                          setTheme("light");
                          setThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                          theme === "light" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Light
                      </button>
                      <button
                        onClick={() => {
                          setTheme("dark");
                          setThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                          theme === "dark" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        Dark
                      </button>
                      <button
                        onClick={() => {
                          setTheme("system");
                          setThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                          theme === "system" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        System
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UserAvatar name={user.name} profilePicture={user.profilePicture} email={user.email} />
                    <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
                  </Link>
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

            <div className="md:hidden flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Theme selector"
                >
                  {resolvedTheme === "dark" ? (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>
                
                {themeMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setThemeMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                      <button
                        onClick={() => {
                          setTheme("light");
                          setThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                          theme === "light" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Light
                      </button>
                      <button
                        onClick={() => {
                          setTheme("dark");
                          setThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                          theme === "dark" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        Dark
                      </button>
                      <button
                        onClick={() => {
                          setTheme("system");
                          setThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                          theme === "system" ? "text-amber-600 dark:text-amber-500 font-medium" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        System
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  setThemeMenuOpen(false);
                }}
                className="relative w-8 h-8 flex flex-col justify-center items-center"
              >
                <span
                  className={`block h-[2px] w-6 bg-gray-800 dark:bg-gray-200 rounded transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-gray-800 dark:bg-gray-200 rounded my-[5px] transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-gray-800 dark:bg-gray-200 rounded transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-0 bg-black bg-opacity-40 z-40 transform transition-all duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute right-0 top-0 w-3/4 max-w-xs h-full bg-white dark:bg-gray-900 shadow-xl rounded-l-2xl p-4 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <NavLinks
              mobile
              onClick={() => setIsOpen(false)}
              userRole={user?.role}
            />

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl p-3 shadow-sm gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <UserAvatar name={user.name} profilePicture={user.profilePicture} email={user.email} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={loggingOut}
                    className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 text-sm"
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

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">Confirm Logout</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to log out
              {user?.name ? `, ${user.name}` : ""}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loggingOut}
                className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
