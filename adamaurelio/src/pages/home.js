import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Adam Aurelio
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium">
              Software Engineer | Full-Stack Developer | RPA Specialist
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Transforming complex challenges into elegant solutions through
              code, automation, and innovative thinking.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/services"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                View Services
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
              <div className="text-white text-7xl font-bold">
                <span>{"< />"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Highlight Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What I Do
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Full-Stack Development
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Building robust applications with Python, C#, .NET, and modern
                web technologies. From database design to user interfaces.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Process Automation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Designing and implementing RPA solutions with UiPath,
                streamlining business processes and increasing efficiency.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Database Solutions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Expert in Oracle PL/SQL and SQL Server, creating optimized
                queries, stored procedures, and data architectures.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                DevOps & CI/CD
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Implementing continuous integration and deployment pipelines
                with Azure DevOps and Docker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-bold">7+</h3>
              <p className="text-lg md:text-xl opacity-90">Years Experience</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-bold">5</h3>
              <p className="text-lg md:text-xl opacity-90">
                CompTIA Certifications
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-bold">100+</h3>
              <p className="text-lg md:text-xl opacity-90">Projects Delivered</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-bold">∞</h3>
              <p className="text-lg md:text-xl opacity-90">Lines of Code</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            I'm always interested in hearing about new opportunities,
            collaborations, or just connecting with fellow developers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              to="/contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get In Touch
            </Link>
            <Link
              to="/services"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
