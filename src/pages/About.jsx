import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";

const About = () => {
  return (
    <section
      id="about"
      className="py-20 px-4 md:px-8 max-w-4xl mx-auto"
    >
      <Seo
        title="About"
        path="/about"
        description="About Adam Aurelio — a software engineer in the Des Moines area focused on automation, reliable systems, and clear delivery."
      />

      <Reveal
        as="h1"
        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8"
      >
        About Me
      </Reveal>

      <Reveal className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          I&apos;m a software engineer in the Des Moines area with 7+ years
          building the kind of software that quietly keeps a business running —
          automation, integrations, and the operational glue between systems.
          Most of my career has been in a regulated utility environment, where
          &quot;it works&quot; isn&apos;t enough: the work also has to be secure,
          auditable, and dependable at 2&nbsp;a.m.
        </p>
        <p>
          My day-to-day spans full-stack development in Python, C#, and .NET,
          deep Oracle PL/SQL work, and robotic process automation with UiPath.
          I&apos;m happiest when I can take a slow, manual, error-prone
          process and turn it into something automated, observable, and
          repeatable — then wrap it in CI/CD so it stays that way.
        </p>
        <p>
          I also lead. I run standups and sprint planning for a small team of
          developers, mentor engineers, write onboarding plans, and step in as a
          technical point of contact when delivery needs someone to align the
          moving pieces. I care about leaving systems — and people — better than
          I found them.
        </p>
        <p>
          Outside of work I coach youth soccer, and I&apos;ve spent years
          volunteering in my community, from directing volunteer teams to
          running audio-visual production at my church. This site starts as my
          résumé, but I&apos;ll be growing it into a home for projects and
          writing over time.
        </p>
      </Reveal>

      <Reveal className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/resume"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          View my résumé
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Get in touch
        </Link>
      </Reveal>
    </section>
  );
};

export default About;
