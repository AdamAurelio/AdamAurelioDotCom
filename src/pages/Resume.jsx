import EmailLink from "../components/EmailLink";
import Reveal from "../components/Reveal";

const Resume = () => {
  return (
    <section
      id="resume"
      className="py-12 px-4 md:px-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors"
    >
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 md:p-12">
        <Reveal
          as="header"
          className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8 flex flex-col sm:flex-row items-center gap-8"
        >
          <img
            src="/profile.jpg"
            alt="Adam Aurelio"
            width="128"
            height="128"
            className="w-32 h-32 object-cover rounded-full shadow-md ring-2 ring-gray-100 dark:ring-gray-700 shrink-0"
          />
          <div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Adam Aurelio
            </h1>
            <p className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-3">
              Software Engineer
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Des Moines, IA area · <EmailLink /> ·{" "}
              <a
                href="https://linkedin.com/in/adamaurelio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                linkedin.com/in/adamaurelio
              </a>
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Software engineer with 7+ years building enterprise automation,
              integrations, and resilient operations across Oracle, Python,
              PL/SQL, and RPA platforms. Consistent track record delivering
              secure, auditable workflows for access governance, CI/CD
              pipelines, and operational process automation in regulated utility
              environments.
            </p>
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Core Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Languages
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Python, C#, SQL/PL/SQL, PowerShell, VB.NET
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Platforms &amp; Tools
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Oracle APEX, Oracle Fusion, UiPath, Azure DevOps, Docker, AWS
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Automation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                CI/CD pipelines, API integrations, idempotent retry patterns,
                RPA orchestration
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Databases &amp; Ops
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Oracle, SQL Server, incident runbooks, operational monitoring
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Experience
          </h2>

          <div className="mb-8 bg-white dark:bg-gray-800 border-l-4 border-blue-600 px-6 py-4 rounded-r-lg">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  MidAmerican Energy / Berkshire Hathaway Energy
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Des Moines, Iowa
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                2015 – Present
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Software Engineer II
            </h4>

            <h5 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-2">
              Access Governance &amp; Compliance Automation
            </h5>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside mb-5">
              <li>
                Automated ~80% of an enterprise role-provisioning workflow,
                eliminating ~32 hours/week of manual effort across
                access-governance operations.
              </li>
              <li>
                Compressed compliance-driven access approval cycles from 3 weeks
                to under 5 days (~67% reduction), improving audit-trail
                completeness and compliance posture.
              </li>
              <li>
                Automated go-live access provisioning end-to-end, removing
                manual tasks and after-hours support while adding built-in audit
                trails for compliance.
              </li>
              <li>
                Architected a full-stack access-governance application using
                Python APIs and Oracle SQL to automate enterprise security
                provisioning and reduce manual risk.
              </li>
            </ul>

            <h5 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-2">
              Systems Design &amp; Integration
            </h5>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside mb-5">
              <li>
                Designed and maintained Azure DevOps CI/CD pipelines and Docker
                developer tooling to improve deployment repeatability across
                environments.
              </li>
              <li>
                Built and maintained complex PL/SQL packages and .NET services
                supporting mission-critical business processes including
                purchase orders, intercompany billing, and HR workflows.
              </li>
              <li>
                Implemented Oracle APEX dashboards and PL/SQL utilities for
                operational KPI tracking and environmental compliance reporting.
              </li>
              <li>
                Designed resilient UiPath automations with retry and idempotency
                patterns, reducing production failure rates across automated
                workflows.
              </li>
            </ul>

            <h5 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-2">
              Technical Leadership
            </h5>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
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
                stakeholders, translating business needs into actionable work.
              </li>
              <li>
                Authored 30/60/90 onboarding plans to ramp new and transitioning
                developers to productivity faster.
              </li>
              <li>
                Act as a technical point of contact for customers, aligning
                delivery with business expectations.
              </li>
              <li>
                Mentored junior developers and conducted technical interviews.
              </li>
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

          <div className="mb-8 bg-white dark:bg-gray-800 border-l-4 border-blue-600 px-6 py-4 rounded-r-lg">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Technology Resource Center
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Prior to 2015
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Analyst I / II
            </h4>

            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Education &amp; Certifications
          </h2>

          <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Drake University
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Des Moines, Iowa</p>
            <p className="text-gray-700 dark:text-gray-300">
              Bachelor of Arts &amp; Sciences
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Certifications
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>CompTIA Security+ (valid through 2029)</li>
              <li>CompTIA Network+ (valid through 2029)</li>
              <li>CompTIA A+ (valid through 2029)</li>
            </ul>
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Leadership &amp; Community
          </h2>

          <div className="mb-6 bg-white dark:bg-gray-800 border-l-4 border-green-600 px-6 py-4 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Iowa United — Coach, Select 14UG
            </h3>
          </div>

          <div className="mb-6 bg-white dark:bg-gray-800 border-l-4 border-green-600 px-6 py-4 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Prior Iowa Asian Alliance — Director of Volunteers
            </h3>
          </div>

          <div className="mb-6 bg-white dark:bg-gray-800 border-l-4 border-green-600 px-6 py-4 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Prior Walnut Creek Community Church — Audio-Visual Team Lead
            </h3>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Resume;
