import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-gray-900">
            <a href="#home" className="hover:text-blue-600 transition-colors">
              Adam Aurelio
            </a>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#resume"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Resume
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
