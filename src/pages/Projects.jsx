/* eslint-disable react/prop-types */
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import OutboundLink from "../components/OutboundLink";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import ButtonLink from "../components/ui/ButtonLink";
import Icon from "../components/ui/Icon";
import IconBadge from "../components/ui/IconBadge";
import { projects, seoDescription } from "../content/projects";

const ProjectCard = ({ project }) => (
  <Card as="article" interactive padding="p-7" className="flex flex-col">
    <div className="flex items-center gap-4 mb-4">
      <IconBadge name={project.icon} size="lg" />
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white">{project.name}</h2>
    </div>
    <p className="text-navy-600 dark:text-navy-300 leading-relaxed flex-grow">{project.blurb}</p>
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
      {project.stack.map((tech) => (
        <li
          key={tech}
          className="inline-block rounded-full bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 text-xs font-medium px-3 py-1"
        >
          {tech}
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
        <Icon name="arrow-up-right" className="h-4 w-4" />
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
        title="Things I've worked on"
        lede="A few highlights, from enterprise automation to this site."
        className="mb-12 max-w-2xl"
      />

      <Reveal className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </Reveal>

      <Reveal className="mt-14 text-center">
        <p className="text-navy-600 dark:text-navy-300 mb-4">Got a problem worth solving?</p>
        <ButtonLink to="/contact">Let&apos;s talk</ButtonLink>
      </Reveal>
    </Container>
  );
};

export default Projects;
