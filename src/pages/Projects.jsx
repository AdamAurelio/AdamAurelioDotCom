/* eslint-disable react/prop-types */
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import OutboundLink from "../components/OutboundLink";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import ButtonLink from "../components/ui/ButtonLink";
import { projects, seoDescription } from "../content/projects";

const ProjectCard = ({ project }) => (
  <Card as="article" interactive padding="p-8" className="flex flex-col">
    <h2 className="text-2xl font-bold text-navy-900 dark:text-white">{project.name}</h2>
    <p className="font-mono text-xs uppercase tracking-wide text-gold-700 dark:text-gold-300 font-semibold mt-2 mb-4">
      {project.stack.join(" · ")}
    </p>
    <p className="text-navy-600 dark:text-navy-300 leading-relaxed flex-grow">{project.blurb}</p>
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
      {project.tags.map((tag) => (
        <li
          key={tag}
          className="inline-block rounded-full bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 text-xs font-medium px-3 py-1"
        >
          {tag}
        </li>
      ))}
    </ul>
    {project.href && (
      <OutboundLink
        href={project.href}
        label={project.name}
        className="mt-5 inline-flex items-center gap-1 text-teal-700 dark:text-teal-300 font-semibold hover:underline"
      >
        {project.hrefLabel}
        {/* arrow-up-right icon: Lucide (ISC) — see NOTICE. */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </OutboundLink>
    )}
  </Card>
);

const Projects = () => {
  return (
    <Container as="section" width="wide" className="py-16">
      <Seo title="Projects" path="/projects" description={seoDescription} />

      <PageHeader
        kicker="Projects"
        title="Things I've built"
        lede="A sample of the work — from enterprise automation and Oracle applications to the spec-driven development practice and the cloud pipeline running this site."
        className="mb-12 max-w-2xl"
      />

      <Reveal className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </Reveal>

      <Reveal className="mt-14 text-center">
        <p className="text-navy-600 dark:text-navy-300 mb-4">
          Want to talk through a problem or an opportunity?
        </p>
        <ButtonLink to="/contact">Get in touch</ButtonLink>
      </Reveal>
    </Container>
  );
};

export default Projects;
