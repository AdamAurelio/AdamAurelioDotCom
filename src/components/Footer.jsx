import Container from "./ui/Container";
import { site } from "../content/site";

const links = [
  { href: site.links.linkedin, label: "LinkedIn" },
  { href: site.links.github, label: "GitHub" },
  { href: `mailto:${[site.email.user, site.email.domain].join("@")}`, label: "Email" },
];

const Footer = () => {
  return (
    <footer className="print:hidden bg-navy-900 dark:bg-navy-950 border-t-2 border-gold-500/70 text-navy-100 py-10 transition-colors">
      <Container className="text-center space-y-4">
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
      </Container>
    </footer>
  );
};

export default Footer;
