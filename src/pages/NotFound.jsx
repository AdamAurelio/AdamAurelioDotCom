import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const NotFound = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md">
        <Seo title="Page not found" />
        <p className="kicker mb-3">Error 404</p>
        <h1 className="text-6xl font-bold text-navy-900 dark:text-white mb-4">
          Lost the trail.
        </h1>
        <p className="text-lg text-navy-600 dark:text-navy-300 mb-8 leading-relaxed">
          This page doesn&apos;t exist — or it moved. No dead ends here, though;
          let&apos;s get you back to solid ground.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors"
          >
            Back home
          </Link>
          <Link
            to="/resume"
            className="px-8 py-3 bg-navy-100 text-navy-800 dark:bg-navy-800 dark:text-navy-100 rounded-lg font-semibold hover:bg-navy-200 dark:hover:bg-navy-700 transition-colors"
          >
            See my work
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
