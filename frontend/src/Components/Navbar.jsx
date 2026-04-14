import { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Menu, X, Shield } from "lucide-react";
import logo from "../assets/logo.png";
import NotificationDropdown from "./NotificationDropdown";

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

  // Close mobile menu on route change
  const handleNavClick = () => setOpen(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-200/50' : 'py-4 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={handleNavClick} className="flex items-center gap-2 sm:gap-4 group flex-shrink-0">
            <div className="relative">
              <img src={logo} alt="Logo" className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-300 brightness-110 saturate-150 contrast-125" />
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-gradient drop-shadow-sm" style={{ fontFamily: 'var(--font-display)' }}>
              TravelGuide
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-stone-600">
            <li><Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link></li>
            <li><Link to="/pakistan-destinations" className="hover:text-emerald-600 transition-colors">Destinations</Link></li>
            {(!isAuthenticated || user?.type === 'traveler') && (
              <li><Link to="/guide-booking" className="hover:text-emerald-600 transition-colors">Guides</Link></li>
            )}
            <li><Link to="/about" className="hover:text-emerald-600 transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link></li>
          </ul>

          {/* Right Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated && <NotificationDropdown />}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-emerald-200 transition-all text-sm font-semibold shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-[10px] text-white overflow-hidden flex-shrink-0">
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
                  <span className="hidden sm:block max-w-[80px] lg:max-w-[100px] truncate">{user?.name}</span>
                  <IoChevronDown className={`w-3 h-3 text-stone-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-xl shadow-stone-200/50 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50">
                      <p className="text-sm font-bold text-stone-900 truncate">{user?.name}</p>
                      <p className="text-xs text-emerald-700 font-semibold capitalize bg-emerald-100 border border-emerald-200 inline-block px-2 py-0.5 rounded-full mt-1.5">
                        {user?.type}
                      </p>
                    </div>
                    <Link
                      to={user?.type === 'guide' ? "/guide-dashboard" : "/traveler-dashboard"}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-stone-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/traveler-signin" className="text-sm font-bold text-stone-700 hover:text-emerald-600 transition-colors px-3 lg:px-4 py-2">
                  Sign In
                </Link>
                <Link to="/guide-registration" className="btn-premium flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  <span className="hidden lg:inline">Become a Guide</span>
                  <span className="lg:hidden">Guide</span>
                </Link>
              </div>
            )}

            {/* Hamburger - Mobile Only */}
            <button
              className="md:hidden p-2 text-stone-800 hover:text-emerald-600 transition-colors rounded-lg hover:bg-stone-100"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-white border-l border-stone-200 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <Link to="/" onClick={handleNavClick} className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="h-12 sm:h-14 w-auto" />
                <span className="text-2xl font-black text-gradient">TravelGuide</span>
              </Link>
              <button onClick={() => setOpen(false)} className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-5 space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/pakistan-destinations", label: "Destinations" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className="flex items-center px-4 py-3 rounded-xl text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all font-semibold"
                >
                  {item.label}
                </Link>
              ))}
              {(!isAuthenticated || user?.type === 'traveler') && (
                <Link
                  to="/guide-booking"
                  onClick={handleNavClick}
                  className="flex items-center px-4 py-3 rounded-xl text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all font-semibold"
                >
                  Guides
                </Link>
              )}
            </nav>

            <div className="p-5 border-t border-stone-100 space-y-3 bg-stone-50/50">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden flex-shrink-0">
                      {user?.profile_photo ? (
                        <img src={`http://localhost:8000${user.profile_photo}`} alt={user.name} className="w-full h-full object-cover" />
                      ) : user?.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-stone-900 truncate">{user?.name}</p>
                      <p className="text-xs text-emerald-600 font-semibold capitalize">{user?.type}</p>
                    </div>
                  </div>
                  <Link
                    to={user?.type === 'guide' ? "/guide-dashboard" : "/traveler-dashboard"}
                    onClick={handleNavClick}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all"
                  >
                    <User className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/traveler-signin"
                    onClick={handleNavClick}
                    className="flex items-center justify-center w-full px-4 py-3 border border-stone-300 text-stone-700 rounded-xl font-bold text-sm hover:bg-stone-100 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/guide-registration"
                    onClick={handleNavClick}
                    className="btn-premium flex items-center justify-center gap-2 w-full py-3 text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Become a Guide
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
