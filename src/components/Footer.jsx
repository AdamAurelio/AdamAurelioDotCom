const links = [
  { href: "https://linkedin.com/in/adamaurelio", label: "LinkedIn" },
  // NOTE: verify this GitHub username before shipping.
  { href: "https://github.com/adamaurelio", label: "GitHub" },
  { href: "mailto:adam.aurelio@gmail.com", label: "Email" },
];

const Footer = () => {
  return (
    <footer className="print:hidden bg-navy-900 dark:bg-navy-950 border-t-2 border-gold-500/70 text-navy-100 py-10 px-4 transition-colors">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <p className="font-serif text-lg text-navy-50">
          Let&apos;s build something worth maintaining.
        </p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
          © {new Date().getFullYear()} Adam Aurelio · Built in Des Moines, Iowa ·
          React &amp; Tailwind, deployed on AWS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
