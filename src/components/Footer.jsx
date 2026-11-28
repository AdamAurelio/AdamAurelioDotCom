import Container from "./ui/Container";
import { site } from "../content/site";

const links = [
  { href: site.links.linkedin, label: "LinkedIn" },
  { href: site.links.github, label: "GitHub" },
  { href: `mailto:${[site.email.user, site.email.domain].join("@")}`, label: "Email" },
];

// The footer rises out of the page as a rolling-hill horizon with a gold
// ridge line. Its top 4rem is transparent and overlaps the end of <main>
// (Layout pads main to make room), so that strip lets clicks through.
const Footer = () => {
  return (
    <footer className="site-footer print:hidden relative z-[1] -mt-16 pt-[6.5rem] pb-10 text-navy-100 pointer-events-none">
      <svg
        className="absolute left-0 top-0 h-16 w-full"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path className="h-fill" d="M0 38C200 12 380 20 560 30S900 4 1100 20 1340 38 1440 22V64H0Z" />
        <path className="h-ridge" d="M0 38C200 12 380 20 560 30S900 4 1100 20 1340 38 1440 22" />
        <path className="h-ridge2" d="M0 52C260 38 480 48 720 44S1160 32 1440 46" />
      </svg>
      <Container className="relative text-center space-y-4 pointer-events-auto">
        <p className="font-serif text-lg text-navy-50">
          Let&apos;s build something worth maintaining.
        </p>
        <nav aria-label="Social" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-navy-300 hover:text-gold-300 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-navy-400">
          © {new Date().getFullYear()} {site.name} · Built in {site.location} ·
          React &amp; Tailwind, deployed on AWS
        </p>
        {/* Soli Deo Gloria — "to God alone the glory", as Bach signed his scores. */}
        <p
          className="!mt-[1.4rem] font-mono text-[0.7rem] font-medium leading-none tracking-[0.45em] pl-[0.45em] text-gold-400 opacity-[0.85]"
          title="Soli Deo Gloria"
        >
          <span aria-hidden="true">S·D·G</span>
          <span className="sr-only">Soli Deo Gloria</span>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
