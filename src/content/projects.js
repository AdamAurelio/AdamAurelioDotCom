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
    href: site.links.repo,
    hrefLabel: "View source",
  },
];
