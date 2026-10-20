// Project showcase. `href` is optional; when present the card links out.
// Icon names refer to src/components/ui/icons.js.

import { site } from "./site";

export const seoDescription =
  "Selected projects by Adam Aurelio — enterprise automation, spec-driven " +
  "development, Oracle applications, and this cloud-deployed website.";

export const projects = [
  {
    icon: "shield-check",
    name: "Access governance",
    stack: ["Python", "Oracle SQL", "Oracle Fusion"],
    blurb:
      "APIs and database logic behind Oracle Fusion access requests: a cart for multiple requests, speed-ups, and approval routing.",
  },
  {
    icon: "sparkles",
    name: "Spec-driven, AI-assisted delivery",
    stack: ["OpenSpec", "SpecKit", "Azure DevOps"],
    blurb:
      "Evaluating spec-driven frameworks, helping build a requirements agent, and demoing a gated workflow that turns requirements into work items.",
  },
  {
    icon: "workflow",
    name: "UiPath Center of Excellence",
    stack: ["UiPath", ".NET", "Azure DevOps", "Docker"],
    blurb:
      "Built the CoE's CI/CD and deployment process (2021–2022): rollback-ready pipelines, change control across affiliates, and retry-safe bots.",
  },
  {
    icon: "chart-column",
    name: "Operational KPI dashboards",
    stack: ["Oracle APEX", "PL/SQL"],
    blurb: "Dashboards for operational KPIs and environmental-compliance reporting.",
  },
  {
    icon: "rocket",
    name: "adamaurelio.com",
    stack: ["React", "AWS", "Terraform", "GitHub Actions"],
    blurb: "This site. Infrastructure as code, with automated dev → QA → prod releases.",
    href: site.links.repo,
    hrefLabel: "View source",
  },
];
