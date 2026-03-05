import React from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-[#0a0f1e] border-t border-white/5 text-white py-16">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* About / Branding */}
                <div className="space-y-6 col-span-1 md:col-span-1">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src={logo} alt="Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]" />
                        <span className="text-xl font-bold tracking-tight text-white">
                            Travel<span className="text-azure">Guide</span>
                        </span>
                    </Link>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        Experience the raw beauty of Pakistan with local experts. From snow-capped peaks to coastal serenity, we make every journey legendary.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-azure hover:border-azure transition-all">
                            <FaFacebookF />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-azure hover:border-azure transition-all">
                            <FaLinkedinIn />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-azure hover:border-azure transition-all">
                            <FaInstagram />
                        </a>
                    </div>
                </div>

                {/* Exploration Links */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Explore</h3>
                    <ul className="space-y-3 text-sm font-medium text-gray-400">
                        <li><Link to="/" className="hover:text-azure transition-colors">Home</Link></li>
                        <li><Link to="/pakistan-destinations" className="hover:text-azure transition-colors">Destinations</Link></li>
                        <li><Link to="/guide-booking" className="hover:text-azure transition-colors">Guides</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Support</h3>
                    <ul className="space-y-3 text-sm font-medium text-gray-400">
                        <li><Link to="/about" className="hover:text-azure transition-colors">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-azure transition-colors">Contact</Link></li>
                        <li><a href="#" className="hover:text-azure transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-azure transition-colors">Terms of Service</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Contact Info</h3>
                    <div className="space-y-4 text-sm text-gray-400">
                        <p className="flex items-center gap-2">
                            <span className="text-azure truncate">Haripur, Pakistan</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span>Email:</span>
                            <a href="mailto:shehzadaqib511@gmail.com" className="hover:text-azure transition-colors truncate">shehzadaqib511@gmail.com</a>
                        </p>
                        <p className="flex items-center gap-2">
                            <span>Phone:</span>
                            <a href="tel:03015440307" className="hover:text-azure transition-colors">03015440307</a>
                        </p>
                    </div>
                </div>

            </div>

            <div className="mt-16 pt-8 border-t border-white/5 text-center px-6">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Travel Guide. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
