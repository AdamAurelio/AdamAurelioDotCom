// Résumé content. Edit this file to update the résumé; src/pages/Resume.jsx is
// only the layout. Keep bullets as plain strings so they print and index cleanly.

export const summary =
  "Software engineer with 10+ years of experience in enterprise automation, " +
  "application development, and integrations in regulated utility environments. " +
  "Work spans Oracle APEX, Python, PL/SQL, UiPath, and Azure DevOps, with recent " +
  "projects in AI-assisted engineering and Databricks application deployment.";

export const seoDescription =
  "Résumé of Adam Aurelio — 10+ years of enterprise automation, application " +
  "development, and integrations, with recent work in AI-assisted engineering.";

export const skills = [
  {
    title: "Languages",
    body: "Python, C#, SQL/PL/SQL, PowerShell, VB.NET",
  },
  {
    title: "Platforms",
    body: "Oracle APEX, Oracle Fusion, UiPath, Databricks, Azure DevOps, Docker, AWS",
  },
  {
    title: "Engineering",
    body: "CI/CD, API integration, RPA orchestration, retry and idempotency patterns, spec-driven development, Azure CLI",
  },
  {
    title: "Data & Operations",
    body: "Oracle, SQL Server, deployment configuration, operational monitoring, incident runbooks",
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
            title: "Access Governance & Automation",
            bullets: [
              "Developed access governance functionality integrating Python APIs with Oracle SQL for Fusion security management.",
              "Promoted Oracle Fusion Access Manager shopping-cart and performance enhancements, enabling users to stage multiple access requests in one session.",
              "Updated approval and provisioning-status logic, including exception handling and manager notification routing; promoted completion-package and role-mapping script changes to production.",
              "Migrated a Use Tax Reversal UiPath automation from Windows-Legacy to Windows and restored operation following Fusion login changes.",
            ],
          },
          {
            title: "AI-Assisted Engineering & Solution Design",
            bullets: [
              "Demonstrated a gated AI-assisted workflow that gathers requirements and creates and updates Azure DevOps work items through Azure CLI.",
              "Contributed to evaluation of spec-driven development frameworks and development of a business requirements agent, with work on approvals, solution documentation, and UAT test cases.",
              "Authored the proposed COMET solution design covering Oracle APEX, PL/SQL services, Databricks integration, role-based permissions, requirements traceability, and UAT scenarios.",
            ],
          },
          {
            title: "Application Modernization & Integration",
            bullets: [
              "Developing an Oracle APEX Tax Calendar application intended to replace spreadsheet-based indirect-tax deadline tracking; captured requirements for category-specific statuses, recurrence, personal action views, and reviewer notifications.",
              "Contributed to modernization of a legacy PHP circuit-management application in Oracle APEX; demonstrated requirements capture, data-model recreation, backlog generation, and circuit-search and mapping features.",
              "Supported MEC Safety Investigations application deployment by addressing Databricks configuration, workspace naming, and service-principal permission issues; completed a release pull request with security updates.",
              "Designed and maintained Azure DevOps CI/CD pipelines and Docker developer tooling; built PL/SQL packages and .NET services for purchase-order, intercompany billing, and HR workflows.",
            ],
          },
          {
            title: "Technical Coordination & Knowledge Sharing",
            bullets: [
              "Serve as team lead for five developers, facilitating daily standups and sprint planning.",
              "Served as acting manager for one month during a leadership transition, coordinating team activities and stakeholder status reporting.",
              "Gather business requirements, scope projects, and support developers through pairing and technical troubleshooting.",
              "Authored 30/60/90-day onboarding plans and incident runbooks; mentored junior developers and conducted technical interviews.",
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
              "Provided Tier I/II enterprise systems support and managed Active Directory access configurations.",
              "Built and maintained VB.NET utilities for internal tooling.",
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

export const certifications = ["CompTIA Security+", "CompTIA Network+", "CompTIA A+"];

export const community = [
  "Iowa United — Former Head Coach, Select 14UG",
  "Iowa Asian Alliance — Former Director of Volunteers",
  "Walnut Creek Community Church — Former Audio-Visual Team Lead",
];
