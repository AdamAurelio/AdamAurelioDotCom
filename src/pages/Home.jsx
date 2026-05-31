import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Reveal
              as="h1"
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Adam Aurelio
            </Reveal>
            {/* One line on xl+ screens, three stacked lines below — never two. */}
            <Reveal delay={70}>
              <p className="hidden xl:block text-xl text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                Software Engineer | Full-Stack Developer | RPA Specialist
              </p>
              <div className="xl:hidden space-y-1 text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium">
                <p>Software Engineer</p>
                <p>Full-Stack Developer</p>
                <p>RPA Specialist</p>
              </div>
            </Reveal>
            <Reveal
              as="p"
              delay={140}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              Transforming complex challenges into elegant solutions through
              code, automation, and innovative thinking.
            </Reveal>
            <Reveal delay={210} className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/services"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                View Services
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Learn More
              </Link>
            </Reveal>
          </div>
          <Reveal delay={120} className="flex justify-center">
            <div className="relative">
              {/* Decorative gradient glow behind the photo */}
              <div
                className="absolute -inset-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30"
                aria-hidden="true"
              />
              <img
                src="/profile.jpg"
                alt="Adam Aurelio"
                width="288"
                height="288"
                className="relative w-72 h-72 object-cover rounded-full shadow-2xl ring-4 ring-white transform hover:scale-105 transition-transform"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Skills Highlight Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <Reveal
            as="h2"
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            What I Do
          </Reveal>
          <Reveal
            delay={80}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Full-Stack Development
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Building robust applications with Python, C#, .NET, and modern
                web technologies. From database design to user interfaces.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Process Automation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Designing and implementing RPA solutions with UiPath,
                streamlining business processes and increasing efficiency.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Database Solutions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Expert in Oracle PL/SQL and SQL Server, creating optimized
                queries, stored procedures, and data architectures.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                DevOps &amp; CI/CD
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Implementing continuous integration and deployment pipelines
                with Azure DevOps and Docker.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-bold">
                <CountUp end={7} suffix="+" />
              </h3>
              <p className="text-lg md:text-xl opacity-90">Years Experience</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-bold">
                <CountUp end={5} />
              </h3>
              <p className="text-lg md:text-xl opacity-90">
                CompTIA Certifications
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-bold">
                <CountUp end={100} suffix="+" />
              </h3>
              <p className="text-lg md:text-xl opacity-90">Projects Delivered</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl md:text-6xl font-bold">∞</h3>
              <p className="text-lg md:text-xl opacity-90">Lines of Code</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 text-white">
        <Reveal className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Let&apos;s Work Together
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            I&apos;m always interested in hearing about new opportunities,
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
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
