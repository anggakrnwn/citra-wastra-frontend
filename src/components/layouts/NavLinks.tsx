import type React from "react";
import { NavLink } from "react-router-dom";

interface NavlinksProps {
  onClick?: () => void;
  mobile?: boolean;
  userRole?: string;
}

const NavLinks: React.FC<NavlinksProps> = ({ onClick, mobile }) => {
  const baseNavItems = [
    { name: "Home", path: "/" },
    { name: "Detection", path: "/detection-page" },
    { name: "Gallery", path: "/gallery-page" },
    { name: "Maps", path: "/maps" },
    { name: "About", path: "/about" },
  ];

  if (mobile) {
    const allItems = [
      ...baseNavItems,
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
                  ? "text-amber-600 dark:text-amber-500 font-semibold border-l-4 border-amber-600 dark:border-amber-500 pl-3 transition"
                  : "text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 pl-4 transition"
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
                ? "text-amber-600 dark:text-amber-500 font-semibold border-b-2 border-amber-600 dark:border-amber-500 pb-1 transition"
                : "text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 pb-1 transition"
            }`
          }
        >
          {name}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;