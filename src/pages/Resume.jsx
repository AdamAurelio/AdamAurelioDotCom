/* eslint-disable react/prop-types */
import EmailLink from "../components/EmailLink";
import Reveal from "../components/Reveal";

const skills = [
  {
    title: "Languages",
    body: "Python, C#, JavaScript, SQL/PL/SQL, PowerShell, VB.NET",
  },
  {
    title: "Web & Full-Stack",
    body: "React, Node.js, REST APIs, Oracle APEX, Oracle REST Data Services (ORDS)",
  },
  {
    title: "Data & Cloud",
    body: "Databricks (Apps, SQL, Connect), AWS, Azure, Docker, Oracle, SQL Server",
  },
  {
    title: "Automation & RPA",
    body: "UiPath, CI/CD pipelines, API integrations, idempotent retry patterns, service accounts",
  },
  {
    title: "Spec-Driven & AI-Assisted Engineering",
    body: "Spec-driven development (OpenSpec, SpecKit), source-controlled specs, GitHub Copilot, Copilot Studio, multi-agent orchestration, human-in-the-loop review",
  },
  {
    title: "DevOps & Delivery",
    body: "Azure DevOps Boards & Pipelines, Git/GitHub, YAML pipelines, dev/QA/prod promotion, incident runbooks",
  },
];

const ExperienceGroup = ({ title, bullets }) => (
  <>
    <h5 className="text-sm font-mono font-semibold uppercase tracking-[0.15em] text-gold-700 dark:text-gold-300 mb-2">
      {title}
    </h5>
    <ul className="space-y-2 text-navy-700 dark:text-navy-300 list-disc list-outside pl-5 mb-6">
      {bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  </>
);

const Resume = () => {
  return (
    <section
      id="resume"
      className="py-12 px-4 md:px-8 bg-navy-100 dark:bg-navy-950 min-h-screen transition-colors"
    >
      <div className="max-w-5xl mx-auto bg-white dark:bg-navy-900 shadow-lg rounded-lg p-8 md:p-12 print:shadow-none print:p-0">
        <Reveal
          as="header"
          className="mb-12 border-b border-navy-200 dark:border-navy-700 pb-8 flex flex-col sm:flex-row items-center gap-8"
        >
          <img
            src="/profile.jpg"
            alt="Adam Aurelio"
            width="128"
            height="128"
            className="w-32 h-32 object-cover rounded-full shadow-md ring-2 ring-gold-300 dark:ring-gold-500/50 shrink-0"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-5xl font-bold text-navy-900 dark:text-white mb-2">
                  Adam Aurelio
                </h1>
                <p className="text-xl font-semibold text-teal-700 dark:text-teal-300 mb-3">
                  Software Engineer
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="print:hidden shrink-0 px-4 py-2 text-sm font-semibold rounded-lg border border-navy-300 dark:border-navy-600 text-navy-700 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
              >
                Print / Save PDF
              </button>
            </div>
            <p className="text-sm text-navy-600 dark:text-navy-400 mb-4">
              Des Moines, IA area · <EmailLink /> ·{" "}
              <a
                href="https://linkedin.com/in/adamaurelio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 dark:text-teal-300 hover:underline"
              >
                linkedin.com/in/adamaurelio
              </a>
            </p>
            <p className="text-lg text-navy-700 dark:text-navy-200 leading-relaxed">
              Software engineer with 7+ years designing and delivering
              enterprise applications, automation, and integrations across
              Oracle, Python, PL/SQL, and cloud data platforms. Proven record of
              secure, auditable workflows for access governance and CI/CD in
              regulated utility environments — now a central builder of the
              company&apos;s spec-driven, AI-assisted software-delivery
              practice: the standards, source-controlled specs, and reusable
              frameworks that my team and engineers across the enterprise ship
              with.
            </p>
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-6">
            Core Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map(({ title, body }) => (
              <div
                key={title}
                className="bg-navy-50 dark:bg-navy-800 p-6 rounded-lg border border-navy-200 dark:border-navy-700"
              >
                <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-navy-700 dark:text-navy-300">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-6">
            Professional Experience
          </h2>

          <div className="mb-8 bg-navy-50 dark:bg-navy-800 border-l-4 border-teal-600 px-6 py-5 rounded-r-lg">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-navy-900 dark:text-white">
                  MidAmerican Energy / Berkshire Hathaway Energy
                </h3>
                <p className="text-navy-600 dark:text-navy-400">
                  Des Moines, Iowa
                </p>
              </div>
              <p className="text-navy-600 dark:text-navy-400 font-medium">
                2015 – Present
              </p>
            </div>

            <h4 className="text-xl font-semibold text-navy-800 dark:text-navy-200 mb-4">
              Software Engineer II
            </h4>

            <ExperienceGroup
              title="Access Governance & Compliance Automation"
              bullets={[
                "Automated ~80% of an enterprise role-provisioning workflow, eliminating ~32 hours/week of manual effort across access-governance operations.",
                "Compressed compliance-driven access approval cycles from 3 weeks to under 5 days (~67% reduction), improving audit-trail completeness and compliance posture.",
                "Automated go-live access provisioning end-to-end, removing manual tasks and after-hours support while adding built-in audit trails for compliance.",
                "Architected a full-stack access-governance application using Python APIs and Oracle SQL to automate enterprise security provisioning and reduce manual risk.",
              ]}
            />

            <ExperienceGroup
              title="Spec-Driven Development & AI-Assisted Engineering"
              bullets={[
                "Central builder of the company's spec-driven development practice: co-developed the enterprise agent-assisted delivery model spanning Oracle APEX, Databricks, and standard application stacks, and shaped the reusable specs, prompts, standards, and documentation adopted by my team and engineers across the enterprise.",
                "Championed source-controlled specifications as the foundation of delivery — evaluating OpenSpec, SpecKit, and Superpowers and driving the lightweight, source-controlled default recommendation adopted for enterprise use.",
                "Designed and demonstrated a reusable requirements-engineering framework that converts business needs into requirements, solution-design and architecture artifacts, diagrams, and an Azure DevOps-ready backlog, reducing rework from incomplete requirements.",
                "Built and demonstrated a React application on Databricks Apps for safety-incident reporting, resolving integration issues across authentication, SQL warehouses, catalog/table permissions, and storage access.",
              ]}
            />

            <ExperienceGroup
              title="Systems Design & Integration"
              bullets={[
                "Designed and maintained Azure DevOps CI/CD pipelines and Docker developer tooling to improve deployment repeatability across environments.",
                "Designed API-first integration between Oracle APEX, Oracle Fusion, and UiPath for access provisioning/deprovisioning, using database status flags and stored-procedure/API patterns to coordinate automated workflows.",
                "Built and maintained complex PL/SQL packages and .NET services supporting mission-critical business processes including purchase orders, intercompany billing, and HR workflows.",
                "Implemented Oracle APEX dashboards and PL/SQL utilities for operational KPI tracking and environmental compliance reporting.",
                "Designed resilient UiPath automations with retry and idempotency patterns, reducing production failure rates across automated workflows.",
              ]}
            />

            <h5 className="text-sm font-mono font-semibold uppercase tracking-[0.15em] text-gold-700 dark:text-gold-300 mb-2">
              Technical Leadership
            </h5>
            <ul className="space-y-2 text-navy-700 dark:text-navy-300 list-disc list-outside pl-5">
              <li>
                Serve as team lead for 5 developers, running daily standups and
                sprint planning to keep delivery on track and surface blockers
                early.
              </li>
              <li>
                Stepped in as acting manager for one month during a leadership
                transition, owning team coordination, stakeholder status
                reporting, and developer support with no disruption to delivery.
              </li>
              <li>
                Unblock developers through hands-on pairing and technical
                troubleshooting, keeping in-flight work moving across the team.
              </li>
              <li>
                Scope new projects and gather initial requirements from
                stakeholders, translating business needs into epics, features,
                user stories, and prioritized delivery plans.
              </li>
              <li>
                Consolidate cross-team status into leadership-facing portfolio
                updates across application development and automation, surfacing
                delivery risks, production promotions, and priorities.
              </li>
              <li>
                Authored 30/60/90 onboarding plans to ramp new and transitioning
                developers to productivity faster.
              </li>
              <li>
                Act as a technical point of contact for customers, aligning
                delivery with business expectations.
              </li>
              <li>Mentored junior developers and conducted technical interviews.</li>
              <li>
                Authored incident runbooks and playbooks; coordinated
                cross-functional response for production incidents.
              </li>
              <li>
                Participated in architecture discussions covering data modeling,
                deployment strategies, and cross-application integration
                patterns.
              </li>
            </ul>
          </div>

          <div className="mb-8 bg-navy-50 dark:bg-navy-800 border-l-4 border-teal-600 px-6 py-5 rounded-r-lg">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-navy-900 dark:text-white">
                  Technology Resource Center
                </h3>
              </div>
              <p className="text-navy-600 dark:text-navy-400 font-medium">
                Prior to 2015
              </p>
            </div>

            <h4 className="text-xl font-semibold text-navy-800 dark:text-navy-200 mb-3">
              Analyst I / II
            </h4>

            <ul className="space-y-2 text-navy-700 dark:text-navy-300 list-disc list-outside pl-5">
              <li>
                Delivered Tier I/II support for enterprise systems, resolving
                high-impact incidents.
              </li>
              <li>
                Managed identity &amp; access management (IAM) and strengthened
                internal access controls.
              </li>
              <li>
                Built and maintained VB.NET utilities to improve reliability and
                maintainability of internal tooling.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-6">
            Education &amp; Certifications
          </h2>

          <div className="mb-6 bg-navy-50 dark:bg-navy-800 p-6 rounded-lg border border-navy-200 dark:border-navy-700">
            <h3 className="text-xl font-bold text-navy-900 dark:text-white">
              Drake University
            </h3>
            <p className="text-navy-600 dark:text-navy-400">Des Moines, Iowa</p>
            <p className="text-navy-700 dark:text-navy-300">
              Bachelor of Arts &amp; Sciences
            </p>
          </div>

          <div className="bg-navy-50 dark:bg-navy-800 p-6 rounded-lg border border-navy-200 dark:border-navy-700">
            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-4">
              Certifications
            </h3>
            <ul className="space-y-2 text-navy-700 dark:text-navy-300 list-disc list-outside pl-5">
              <li>CompTIA Security+ (valid through 2029)</li>
              <li>CompTIA Network+ (valid through 2029)</li>
              <li>CompTIA A+ (valid through 2029)</li>
            </ul>
          </div>
        </Reveal>

        <Reveal as="section">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-6">
            Leadership &amp; Community
          </h2>

          {[
            "Iowa United — Coach, Select 14UG",
            "Prior Iowa Asian Alliance — Director of Volunteers",
            "Prior Walnut Creek Community Church — Audio-Visual Team Lead",
          ].map((item) => (
            <div
              key={item}
              className="mb-4 bg-navy-50 dark:bg-navy-800 border-l-4 border-gold-500 px-6 py-4 rounded-r-lg"
            >
              <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                {item}
              </h3>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default Resume;
