import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <p className="text-gray-300">
          © {new Date().getFullYear()} Adam Aurelio. All rights reserved.
        </p>
        <p className="text-gray-400">
          Connect on{" "}
          <a
            href="https://linkedin.com/in/adamaurelio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
