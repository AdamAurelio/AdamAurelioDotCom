/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";

const projects = [
  {
    name: "Enterprise Access-Governance Platform",
    stack: ["Python", "Oracle SQL", "REST APIs"],
    blurb:
      "A full-stack application that automates security-access provisioning into Oracle Fusion. It replaced a manual, multi-team approval chain with an automated workflow — compressing a 3-week cycle to under 5 days while adding complete, built-in audit trails for compliance.",
    tags: ["Automation", "Security", "Full-stack"],
  },
  {
    name: "Spec-Driven Development Practice",
    stack: ["OpenSpec", "SpecKit", "GitHub Copilot", "Copilot Studio"],
    blurb:
      "Co-built my company's spec-driven, AI-assisted delivery practice: source-controlled specifications, reusable prompts and standards, and delivery paths spanning Oracle APEX, Databricks, and conventional stacks — adopted by my team and engineers across the enterprise.",
    tags: ["AI", "Process", "Enablement"],
  },
  {
    name: "UiPath Center of Excellence",
    stack: ["UiPath", ".NET (C# / VB)", "Azure DevOps", "Docker"],
    blurb:
      "Established the organization's RPA practice from the ground up: reusable automation frameworks, resilient bots with retry/idempotency patterns, and CI/CD pipelines so automations deploy and recover predictably instead of failing silently.",
    tags: ["RPA", "DevOps", "Platform"],
  },
  {
    name: "Operational KPI Web Application",
    stack: ["Oracle APEX", "PL/SQL"],
    blurb:
      "A full-stack PL/SQL application with dashboards for tracking operational KPIs and environmental-compliance reporting — giving stakeholders a live view of the metrics that matter instead of month-end spreadsheets.",
    tags: ["Data", "Reporting", "Oracle"],
  },
  {
    name: "adamaurelio.com",
    stack: [
      "React 19",
      "Vite",
      "Tailwind",
      "AWS S3 + CloudFront",
      "Terraform",
      "GitHub Actions",
    ],
    blurb:
      "This website. A static React SPA with a fully automated, multi-environment CI/CD pipeline (dev / QA / prod), infrastructure defined as code with Terraform, and hardened security headers. Fast, cheap to run, and self-deploying.",
    tags: ["Web", "IaC", "CI/CD"],
    href: "https://github.com/AdamAurelio/AdamAurelioDotCom",
    hrefLabel: "View source",
  },
];

const Card = ({ project }) => {
  return (
    <article className="bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-8 flex flex-col">
      <h3 className="text-2xl font-bold text-navy-900 dark:text-white">
        {project.name}
      </h3>
      <p className="font-mono text-xs uppercase tracking-wide text-gold-700 dark:text-gold-300 font-semibold mt-2 mb-4">
        {project.stack.join(" · ")}
      </p>
      <p className="text-navy-600 dark:text-navy-300 leading-relaxed flex-grow">
        {project.blurb}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block rounded-full bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 text-xs font-medium px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1 text-teal-700 dark:text-teal-300 font-semibold hover:underline"
        >
          {project.hrefLabel}
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
        </a>
      )}
    </article>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
      <Seo
        title="Projects"
        path="/projects"
        description="Selected projects by Adam Aurelio — enterprise automation, spec-driven development, Oracle applications, and this cloud-deployed website."
      />

      <Reveal as="p" className="kicker mb-2">
        Projects
      </Reveal>
      <Reveal
        as="h1"
        className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-4"
      >
        Things I&apos;ve built
      </Reveal>
      <Reveal
        as="p"
        delay={70}
        className="text-lg text-navy-600 dark:text-navy-300 mb-12 max-w-2xl"
      >
        A sample of the work — from enterprise automation and Oracle
        applications to the spec-driven development practice and the cloud
        pipeline running this site.
      </Reveal>

      <Reveal className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Card key={project.name} project={project} />
        ))}
      </Reveal>

      <Reveal className="mt-14 text-center">
        <p className="text-navy-600 dark:text-navy-300 mb-4">
          Want to talk through a problem or an opportunity?
        </p>
        <Link
          to="/contact"
          className="px-8 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors shadow-sm hover:shadow-md inline-block"
        >
          Get in touch
        </Link>
      </Reveal>
    </section>
  );
};

export default Projects;
