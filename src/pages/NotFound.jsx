import Seo from "../components/Seo";
import ButtonLink from "../components/ui/ButtonLink";

const NotFound = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md">
        <Seo title="Page not found" />
        <p className="kicker mb-3">Error 404</p>
        <h1 className="text-6xl font-bold text-navy-900 dark:text-white mb-4">Lost the trail.</h1>
        <p className="text-lg text-navy-600 dark:text-navy-300 mb-8 leading-relaxed">
          This page doesn&apos;t exist — or it moved. No dead ends here, though;
          let&apos;s get you back to solid ground.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <ButtonLink to="/">Back home</ButtonLink>
          <ButtonLink to="/projects" variant="secondary">
            See my projects
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
