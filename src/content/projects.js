// Project showcase. `href` is optional; when present the card links out.

import { site } from "./site";

export const seoDescription =
  "Selected projects by Adam Aurelio — enterprise automation, spec-driven " +
  "development, Oracle applications, and this cloud-deployed website.";

export const projects = [
  {
    name: "Enterprise Access-Governance Platform",
    stack: ["Python", "Oracle SQL", "REST APIs"],
    blurb:
      "Access-governance functionality for Oracle Fusion security management, integrating Python APIs with Oracle SQL. Recent work includes a shopping cart that lets users stage multiple access requests in one session, performance enhancements, and approval and provisioning-status logic with exception handling and manager notification routing.",
    tags: ["Automation", "Security", "Full-stack"],
  },
  {
    name: "Spec-Driven Development Practice",
    stack: ["OpenSpec", "SpecKit", "GitHub Copilot", "Copilot Studio"],
    blurb:
      "Contributing to my company's spec-driven, AI-assisted delivery practice: evaluating spec-driven development frameworks, helping develop a business requirements agent, and demonstrating a gated workflow that gathers requirements and creates and updates Azure DevOps work items through Azure CLI.",
    tags: ["AI", "Process", "Enablement"],
  },
  {
    name: "UiPath Center of Excellence",
    stack: ["UiPath", ".NET (C# / VB)", "Azure DevOps", "Docker"],
    blurb:
      "Built the CI/CD and deployment process for the organization's RPA Center of Excellence (2021–2022): a deployment pipeline with automated rollback, change control across affiliates, and standardized deployment documentation — plus resilient UiPath automations with retry and idempotency patterns.",
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
    href: site.links.repo,
    hrefLabel: "View source",
  },
];
