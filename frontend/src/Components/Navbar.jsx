import { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Menu, X, Shield } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 glass-panel' : 'py-5 bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Travel<span className="text-azure">Guide</span>
          </span>
        </Link>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <li><Link to="/" className="hover:text-azure transition-colors">Home</Link></li>
          <li><Link to="/pakistan-destinations" className="hover:text-azure transition-colors">Destinations</Link></li>

          {(!isAuthenticated || user?.type === 'traveler') && (
            <li><Link to="/guide-booking" className="hover:text-azure transition-colors">Guides</Link></li>
          )}

          <li><Link to="/about" className="hover:text-azure transition-colors">About</Link></li>
          <li><Link to="/contact" className="hover:text-azure transition-colors">Contact</Link></li>
        </ul>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-azure to-aurora flex items-center justify-center text-[10px] overflow-hidden">
                  {user?.profile_photo ? (
                    <img
                      src={`http://localhost:8000${user.profile_photo}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <span className="max-w-[100px] truncate">{user?.name}</span>
                <IoChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="px-5 py-4 border-b border-white/10">
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-blue-400 capitalize bg-blue-500/10 inline-block px-2 py-0.5 rounded-full mt-1">
                      {user?.type}
                    </p>
                  </div>
                  <Link
                    to={user?.type === 'guide' ? "/guide-dashboard" : "/traveler-dashboard"}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-azure" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/traveler-signin" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link to="/guide-registration" className="btn-premium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Become a Guide
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
