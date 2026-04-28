import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const Footer = () => {
    return (
        <footer className="bg-stone-50 border-t border-stone-200 text-stone-900 py-12 sm:py-16 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">

                {/* About / Branding - spans 2 cols on smallest screens */}
                <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-5">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src={logo} alt="Logo" className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-300 brightness-110 saturate-150 contrast-125" />
                        <span className="text-2xl sm:text-3xl font-black tracking-tight text-gradient drop-shadow-sm" style={{ fontFamily: 'var(--font-display)' }}>
                            TravelGuide
                        </span>
                    </Link>
                    <p className="text-stone-600 leading-relaxed text-sm font-medium">
                        Experience the raw beauty of Pakistan with local experts. From the rocky mountains of Balochistan to the lush green valleys of KPK, we make every journey legendary.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all hover:-translate-y-1">
                            <FaFacebookF className="w-3.5 h-3.5" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all hover:-translate-y-1">
                            <FaLinkedinIn className="w-3.5 h-3.5" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all hover:-translate-y-1">
                            <FaInstagram className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Exploration Links */}
                <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-wide">Explore</h3>
                    <ul className="space-y-2 sm:space-y-3 text-sm font-semibold text-stone-600">
                        <li><Link to="/" className="hover:text-emerald-600 hover:underline hover:underline-offset-4 transition-all">Home</Link></li>
                        <li><Link to="/pakistan-destinations" className="hover:text-emerald-600 hover:underline hover:underline-offset-4 transition-all">Destinations</Link></li>
                        <li><Link to="/guide-booking" className="hover:text-emerald-600 hover:underline hover:underline-offset-4 transition-all">Guides</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-wide">Support</h3>
                    <ul className="space-y-2 sm:space-y-3 text-sm font-semibold text-stone-600">
                        <li><Link to="/about" className="hover:text-emerald-600 hover:underline hover:underline-offset-4 transition-all">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-emerald-600 hover:underline hover:underline-offset-4 transition-all">Contact</Link></li>
                        <li><a href="#" className="hover:text-emerald-600 hover:underline hover:underline-offset-4 transition-all">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-emerald-600 hover:underline hover:underline-offset-4 transition-all">Terms of Service</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="col-span-2 sm:col-span-1 space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-wide">Contact Info</h3>
                    <div className="space-y-3 text-sm font-medium text-stone-600">
                        <p className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-0.5">📍</span>
                            <span>Haripur, Pakistan</span>
                        </p>
                        <p className="flex items-start gap-2 flex-wrap">
                            <span className="text-stone-400 font-bold">Email:</span>
                            <a href="mailto:shehzadaqib511@gmail.com" className="hover:text-emerald-600 font-semibold transition-colors break-all">shehzadaqib511@gmail.com</a>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-stone-400 font-bold">Phone:</span>
                            <a href="tel:03015440307" className="hover:text-emerald-600 font-semibold transition-colors">03015440307</a>
                        </p>
                    </div>
                </div>

            </div>

            <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-stone-200 text-center px-4 sm:px-6">
                <p className="text-stone-500 text-xs font-bold uppercase tracking-widest drop-shadow-sm">
                    &copy; {new Date().getFullYear()} Travel Guide. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
