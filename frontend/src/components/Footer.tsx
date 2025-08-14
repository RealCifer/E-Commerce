import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-sky-300 via-sky-200 to-yellow-100 text-gray-800 py-8 shadow-lg backdrop-blur-md bg-opacity-70">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm animate-fadeIn">

        {/* Company Info */}
        <div>
          <h2 className="text-gray-900 text-lg font-bold mb-3 hover:text-sky-600 transition-colors duration-300">
            URBAN STORE
          </h2>
          <p className="text-xs leading-relaxed opacity-80">
            Your one-stop destination for quality clothes at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-gray-900 font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            {[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="relative group inline-block"
                >
                  <span className="text-gray-700 group-hover:text-sky-600 transition-colors duration-300 transform group-hover:scale-105">
                    {link.name}
                  </span>
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-sky-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h2 className="text-gray-900 font-semibold mb-3">Support</h2>
          <ul className="space-y-2">
            {[
              { name: "FAQ", path: "/faq" },
              { name: "Returns", path: "/returns" },
              { name: "Shipping Info", path: "/shipping" },
              { name: "Privacy Policy", path: "/privacy" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="relative group inline-block"
                >
                  <span className="text-gray-700 group-hover:text-sky-600 transition-colors duration-300 transform group-hover:scale-105">
                    {link.name}
                  </span>
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-sky-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-gray-900 font-semibold mb-3">Contact</h2>
          {[
            { icon: <Mail size={14} />, text: "support@URBANSTORE.com", href: "mailto:support@URBANSTORE.com" },
            { icon: <Phone size={14} />, text: "+91 987000000", href: "tel:+919870000000" },
            { icon: <MapPin size={14} />, text: "IIIT Dharwad, Karnataka" },
          ].map(({ icon, text, href }) => (
            <p
              key={text}
              className="flex items-center gap-2 text-gray-700 hover:text-sky-600 transition-colors duration-300 transform hover:scale-105 cursor-pointer"
            >
              {href ? <a href={href} className="flex items-center gap-2">{icon}{text}</a> : <>{icon}{text}</>}
            </p>
          ))}
        </div>
      </div>  

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-600 mt-5 border-t border-gray-300 pt-3">
        &copy; {new Date().getFullYear()} URBAN STORE. All rights reserved.
      </div>
    </footer>
  );
}
