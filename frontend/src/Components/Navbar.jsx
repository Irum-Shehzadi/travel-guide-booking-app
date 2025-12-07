import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-10 py-5 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
        Travel Booking Guide
      </div>

      {/* Menu */}
      <ul className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
        <li className="cursor-pointer hover:text-blue-600">
          <Link to="/">Home</Link>
        </li>

        {/* Simple Destination Link (no dropdown) */}
        <li className="cursor-pointer hover:text-blue-600">
          <Link to="/pakistan-destinations">Destinations</Link>
        </li>

        <li className="cursor-pointer hover:text-blue-600">
          <Link to="/guide-booking">Guide Booking</Link>
        </li>
        <li className="cursor-pointer hover:text-blue-600">
          <Link to="/review">Review</Link>
        </li>
        <li className="cursor-pointer hover:text-blue-600">
          <Link to="/about">About</Link>
        </li>
        <li className="cursor-pointer hover:text-blue-600">
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      {/* Right Buttons */}
      <div className="hidden md:flex items-center gap-4 relative">
        {/* Sign Up with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-blue-600 text-white px-4 py-1 rounded-md flex items-center gap-1"
          >
            Sign Up
            <IoChevronDown />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md overflow-hidden z-50">
              <Link
                to="/traveler-signin"
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                Traveler
              </Link>

              <Link
                to="/guide-registration"
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                Guide
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;