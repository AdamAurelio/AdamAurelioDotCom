import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <p className="text-gray-300">
          © 2023 Adam Aurelio. All rights reserved.
        </p>
        <p className="text-gray-400">
          Follow me on{" "}
          <a
            href="https://twitter.com"
            className="text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            Twitter
          </a>
          ,{" "}
          <a
            href="https://linkedin.com"
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
