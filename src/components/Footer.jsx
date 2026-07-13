import { Link } from "react-router-dom";
import EmailLink from "./EmailLink";

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 dark:border-t dark:border-gray-800 text-white py-10 px-4 transition-colors">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link to="/resume" className="text-gray-300 hover:text-white transition-colors">
            Résumé
          </Link>
          <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">
            Projects
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        <p className="text-gray-400 text-sm">
          <EmailLink />
          <span className="mx-2 text-gray-600" aria-hidden="true">
            ·
          </span>
          <a
            href="https://linkedin.com/in/adamaurelio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            LinkedIn
          </a>
        </p>

        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Adam Aurelio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
