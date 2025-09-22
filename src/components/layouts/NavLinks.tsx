import type React from "react";
import { NavLink } from "react-router-dom";

interface NavlinksProps {
  onClick?: () => void;
  mobile?: boolean;
  userRole?: string;
}

const NavLinks: React.FC<NavlinksProps> = ({ onClick, mobile, userRole }) => {
  const baseNavItems = [
    { name: "Home", path: "/" },
    { name: "Detection", path: "/detection-page" },
    { name: "Gallery", path: "/gallery-page" },
    { name: "Wastra Quiz", path: "/wastraquiz" },
    { name: "About", path: "/about" },
  ];

  const adminNavItems = [
    { name: "Motif Management", path: "/admin/motifs" },
    { name: "User Management", path: "/admin/users" }
  ];

  if (mobile) {
    const allItems = [
      ...baseNavItems,
      ...(userRole === "admin" ? adminNavItems : [])
    ];

    return (
      <>
        {allItems.map(({ name, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClick}
            className={({ isActive }) =>
              `block py-2 ${
                isActive
                  ? "text-amber-600 font-semibold border-l-4 border-amber-600 pl-3 transition"
                  : "text-gray-700 hover:text-amber-600 pl-4 transition"
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <>
      {baseNavItems.map(({ name, path }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${
              isActive
                ? "text-amber-600 font-semibold border-b-2 border-amber-600 pb-1 transition"
                : "text-gray-700 hover:text-amber-600 pb-1 transition"
            }`
          }
        >
          {name}
        </NavLink>
      ))}
      
      {userRole === "admin" && (
        <div className="relative group">
          <button className="text-gray-700 hover:text-amber-600 pb-1 transition flex items-center">
            Admin
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border">
            {adminNavItems.map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm ${
                    isActive
                      ? "bg-amber-50 text-amber-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default NavLinks;