import { Link } from "react-router-dom";
import wastralogo from "../assets/wastralogo.svg";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../services/firebase";
import NavLinks  from "./layouts/NavLinks";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const UserAvatar = ({ photoURL }: { photoURL: string | null }) =>
    photoURL ? (
      <img
        src={photoURL}
        alt="User Avatar"
        className="w-8 h-8 rounded-full border"
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-xs text-gray-600">U</span>
      </div>
    );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
  setLoggingOut(true);
  try {
    await signOut(auth);
    navigate("/");
  } finally {
    setLoggingOut(false);
  }
};

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <img src={wastralogo} alt="Wastra Logo" className="h-10 w-auto" />
          </Link>

          {/* Menu (desktop) */}
          <div className="hidden md:flex space-x-6">
            <NavLinks />
          </div>

          {/* User section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-gray-700">
                  {user.displayName || "User"}
                </span>

                <UserAvatar photoURL={user.photoURL} />
                <button onClick={handleLogout} disabled={loggingOut}>
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

      {/* Menu (mobile) */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <NavLinks mobile onClick={() => setIsOpen(false)} />

            <div className="pt-3 border-t">
              {user ? (
                <div className="flex items-center gap-3">
                  <UserAvatar photoURL={user.photoURL} />
                  <span className="text-gray-700">
                    {user.displayName || "User"}
                  </span>
                  <button onClick={handleLogout} disabled={loggingOut}>
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
