 import React from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About / Branding */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-White-500">Travel Booking Guide</h2>
          <p className="text-white-300">
            Explore amazing destinations across Pakistan with the best travel guides. Make your journey unforgettable!
          </p>
          <div className="flex gap-4 text-white-300">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaLinkedinIn />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-white-300">
            <li><a href="/" className="hover:text-blue-500">Home</a></li>
            <li><a href="/destination" className="hover:text-blue-500">Destination</a></li>
            <li><a href="/guide-booking" className="hover:text-blue-500">Guide Booking</a></li>
            <li><a href="/review" className="hover:text-blue-500">Review</a></li>
            <li><a href="/contact" className="hover:text-blue-500">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <p className="text-white-300">Haripur, Pakistan</p>
          <p className="text-white-300">Email: shehzadaqib511@gmail.com</p>
          <p className="text-white-300">Phone: 03015440307</p>
        </div>

      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-white-500 text-sm">
        &copy; {new Date().getFullYear()} Travel Booking Guide. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
