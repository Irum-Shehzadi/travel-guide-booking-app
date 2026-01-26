import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="w-full flex items-center justify-between px-10 py-5 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
        <Link to="/">Travel Booking Guide</Link>
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
        {isAuthenticated ? (
          /* User is logged in - Show user menu */
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
            >
              <User className="w-4 h-4" />
              <span className="max-w-24 truncate">{user?.name || 'User'}</span>
              <IoChevronDown className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden z-50 border border-gray-100">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link
                  to={user?.type === 'guide' ? "/guide-dashboard" : "/traveler-dashboard"}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user?.type === 'guide' ? 'Guide Dashboard' : 'Traveler Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* User is not logged in - Show Sign Up dropdown */
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 transition-colors"
            >
              Sign Up
              <IoChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md overflow-hidden z-50">
                <Link
                  to="/traveler-signin"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Traveler
                </Link>

                <Link
                  to="/guide-registration"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Guide
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;