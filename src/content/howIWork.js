// "How I Work" principles.

export const seoDescription =
  "The engineering principles behind Adam Aurelio's work: reliability by design, " +
  "observability, source-controlled specs, and honest status.";

export const principles = [
  {
    n: "01",
    title: "Reliability is a feature, not an afterthought",
    body: "I assume everything fails eventually — networks, APIs, the happy path — and design for it up front: idempotent operations, sane retries, timeouts, and graceful fallbacks. The goal is automation you can trust unattended, not a demo that works once.",
  },
  {
    n: "02",
    title: "Make the invisible visible",
    body: "Audit trails, runbooks, dashboards, and honest logging. If an operator can't see what the system did and why, it isn't finished. Observability is how future-me (and the on-call teammate) stays sane.",
  },
  {
    n: "03",
    title: "Write it down",
    body: "Requirements, decisions, and specs live in source control, not in someone's head. Context that's written down is context that survives a handoff, an absence, or a year of forgetting.",
  },
  {
    n: "04",
    title: "Automate the boring, guard the important",
    body: "Repetitive, error-prone toil should be automated. High-stakes actions — granting access, touching production data — keep a human in the loop by design. Knowing which is which is most of the job.",
  },
  {
    n: "05",
    title: "Optimize for the team, not the hero",
    body: "Standards, reviews, onboarding plans, and reusable patterns beat one person being indispensable. I'd rather ship a workflow ten people can run than a script only I understand.",
  },
  {
    n: "06",
    title: "Tell the truth about status",
    body: "Shipped means shipped. A proof of concept is a proof of concept. Straight talk about what's done, what's blocked, and what's risky is the fastest way to earn a team's trust — and keep it.",
  },
];
