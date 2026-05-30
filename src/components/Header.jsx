import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-gray-900">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Adam Aurelio
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/resume"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Resume
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
