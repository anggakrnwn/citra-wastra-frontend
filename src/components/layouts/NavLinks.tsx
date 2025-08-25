import type React from "react";
import { NavLink } from "react-router-dom";

interface NavlinksProps {
  onClick?: () => void;
  mobile?: boolean;
}

const navItems = [
  { name: "Home", path: "/" },
  { name: "Detection", path: "/detection-page" },
  { name: "Gallery", path: "/gallery-page" },
  { name: "Wastra Quiz", path: "/wastraquiz" },
  { name: "About", path: "/about" },
];

const NavLinks: React.FC<NavlinksProps> = ({ onClick, mobile }) => {
  return (
    <>
      {navItems.map(({name, path}) => (
        <NavLink 
          key={path}
          to={path}
          onClick={onClick}
          className={({ isActive }) => `${mobile ? "block py-2" : ""} ${
          isActive ? "text-amber-600 font-semibold border-b-2 border-amber-600 pb-1 transition"
                : "text-gray-700 hover:text-amber-600 pb-1 transition"}`}
        >

        {name}

        </NavLink>
      ))}
    
    </>
  )
}

export default NavLinks