// Site-wide identity. The one place a name, link, or tagline is spelled out;
// components read from here instead of carrying their own copy.

export const site = {
  name: "Adam Aurelio",
  role: "Software Engineer",
  location: "Des Moines, Iowa",
  locationShort: "Des Moines, IA area",
  baseUrl: "https://adamaurelio.com",
  tagline: "I build software that keeps working — and help teams do the same.",
  description:
    "Adam Aurelio — software engineer in Des Moines, Iowa. I build software that " +
    "keeps working, and help teams do the same: automation, apps, integrations, " +
    "and AI-assisted engineering.",

  // Split so the full address is never a contiguous literal in the bundle
  // (see src/components/EmailLink.jsx).
  email: { user: "adam.aurelio", domain: "gmail.com" },

  links: {
    github: "https://github.com/AdamAurelio",
    githubDisplay: "github.com/AdamAurelio",
    linkedin: "https://linkedin.com/in/adamaurelio",
    linkedinDisplay: "linkedin.com/in/adamaurelio",
    repo: "https://github.com/AdamAurelio/AdamAurelioDotCom",
  },

  images: {
    profile: "/profile.jpg",
  },
};
