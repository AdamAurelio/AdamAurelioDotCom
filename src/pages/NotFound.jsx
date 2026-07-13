import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const NotFound = () => {
  return (
    <section className="py-24 px-4 md:px-8 max-w-2xl mx-auto text-center min-h-[60vh] flex flex-col justify-center">
      <Seo
        title="Page not found"
        description="The page you were looking for doesn't exist."
      />
      <p className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        404
      </p>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Page not found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Back home
        </Link>
        <Link
          to="/resume"
          className="px-6 py-3 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          View résumé
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
