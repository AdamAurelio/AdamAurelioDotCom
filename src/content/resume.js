// Résumé content. Edit this file to update the résumé; src/pages/Resume.jsx is
// only the layout. Keep bullets as plain strings so they print and index cleanly.

export const summary =
  "Software engineer with 7+ years designing and delivering enterprise " +
  "applications, automation, and integrations across Oracle, Python, PL/SQL, and " +
  "cloud data platforms. Proven record of secure, auditable workflows for access " +
  "governance and CI/CD in regulated utility environments — now a central builder " +
  "of the company's spec-driven, AI-assisted software-delivery practice: the " +
  "standards, source-controlled specs, and reusable frameworks that my team and " +
  "engineers across the enterprise ship with.";

export const seoDescription =
  "Résumé of Adam Aurelio — 7+ years of enterprise applications, automation, " +
  "access governance, and spec-driven AI-assisted software delivery.";

export const skills = [
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

// Each employer has one or more roles; each role has grouped bullets. A group
// with no title renders as a plain list.
export const experience = [
  {
    company: "MidAmerican Energy / Berkshire Hathaway Energy",
    location: "Des Moines, Iowa",
    dates: "2015 – Present",
    roles: [
      {
        title: "Software Engineer II",
        groups: [
          {
            title: "Access Governance & Compliance Automation",
            bullets: [
              "Automated ~80% of an enterprise role-provisioning workflow, eliminating ~32 hours/week of manual effort across access-governance operations.",
              "Compressed compliance-driven access approval cycles from 3 weeks to under 5 days (~67% reduction), improving audit-trail completeness and compliance posture.",
              "Automated go-live access provisioning end-to-end, removing manual tasks and after-hours support while adding built-in audit trails for compliance.",
              "Architected a full-stack access-governance application using Python APIs and Oracle SQL to automate enterprise security provisioning and reduce manual risk.",
            ],
          },
          {
            title: "Spec-Driven Development & AI-Assisted Engineering",
            bullets: [
              "Central builder of the company's spec-driven development practice: co-developed the enterprise agent-assisted delivery model spanning Oracle APEX, Databricks, and standard application stacks, and shaped the reusable specs, prompts, standards, and documentation adopted by my team and engineers across the enterprise.",
              "Championed source-controlled specifications as the foundation of delivery — evaluating OpenSpec, SpecKit, and Superpowers and driving the lightweight, source-controlled default recommendation adopted for enterprise use.",
              "Designed and demonstrated a reusable requirements-engineering framework that converts business needs into requirements, solution-design and architecture artifacts, diagrams, and an Azure DevOps-ready backlog, reducing rework from incomplete requirements.",
              "Built and demonstrated a React application on Databricks Apps for safety-incident reporting, resolving integration issues across authentication, SQL warehouses, catalog/table permissions, and storage access.",
            ],
          },
          {
            title: "Systems Design & Integration",
            bullets: [
              "Designed and maintained Azure DevOps CI/CD pipelines and Docker developer tooling to improve deployment repeatability across environments.",
              "Designed API-first integration between Oracle APEX, Oracle Fusion, and UiPath for access provisioning/deprovisioning, using database status flags and stored-procedure/API patterns to coordinate automated workflows.",
              "Built and maintained complex PL/SQL packages and .NET services supporting mission-critical business processes including purchase orders, intercompany billing, and HR workflows.",
              "Implemented Oracle APEX dashboards and PL/SQL utilities for operational KPI tracking and environmental compliance reporting.",
              "Designed resilient UiPath automations with retry and idempotency patterns, reducing production failure rates across automated workflows.",
            ],
          },
          {
            title: "Technical Leadership",
            bullets: [
              "Serve as team lead for 5 developers, running daily standups and sprint planning to keep delivery on track and surface blockers early.",
              "Stepped in as acting manager for one month during a leadership transition, owning team coordination, stakeholder status reporting, and developer support with no disruption to delivery.",
              "Unblock developers through hands-on pairing and technical troubleshooting, keeping in-flight work moving across the team.",
              "Scope new projects and gather initial requirements from stakeholders, translating business needs into epics, features, user stories, and prioritized delivery plans.",
              "Consolidate cross-team status into leadership-facing portfolio updates across application development and automation, surfacing delivery risks, production promotions, and priorities.",
              "Authored 30/60/90 onboarding plans to ramp new and transitioning developers to productivity faster.",
              "Act as a technical point of contact for customers, aligning delivery with business expectations.",
              "Mentored junior developers and conducted technical interviews.",
              "Authored incident runbooks and playbooks; coordinated cross-functional response for production incidents.",
              "Participated in architecture discussions covering data modeling, deployment strategies, and cross-application integration patterns.",
            ],
          },
        ],
      },
    ],
  },
  {
    company: "Technology Resource Center",
    dates: "Prior to 2015",
    roles: [
      {
        title: "Analyst I / II",
        groups: [
          {
            bullets: [
              "Delivered Tier I/II support for enterprise systems, resolving high-impact incidents.",
              "Managed identity & access management (IAM) and strengthened internal access controls.",
              "Built and maintained VB.NET utilities to improve reliability and maintainability of internal tooling.",
            ],
          },
        ],
      },
    ],
  },
];

export const education = [
  {
    school: "Drake University",
    location: "Des Moines, Iowa",
    degree: "Bachelor of Arts & Sciences",
  },
];

export const certifications = [
  "CompTIA Security+ (valid through 2029)",
  "CompTIA Network+ (valid through 2029)",
  "CompTIA A+ (valid through 2029)",
];

export const community = [
  "Iowa United — Coach, Select 14UG",
  "Prior Iowa Asian Alliance — Director of Volunteers",
  "Prior Walnut Creek Community Church — Audio-Visual Team Lead",
];
