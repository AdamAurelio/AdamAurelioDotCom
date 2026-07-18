import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";

const roles = [
  "Software Engineer",
  "Full-Stack",
  "Automation & Reliability",
  "Team Lead",
];

const whatIDo = [
  {
    title: "Full-Stack Development",
    body: "React, Python, C#/.NET, and Oracle — from the data model up to the interface people actually use.",
  },
  {
    title: "Automation & Reliability",
    body: "Unattended workflows built to survive the real world: idempotent, retry-safe, and auditable. Automation you don't have to babysit.",
  },
  {
    title: "Access Governance & Security",
    body: "Provisioning, approvals, and audit trails for regulated environments — where getting access right is a compliance requirement, not a nicety.",
  },
  {
    title: "AI-Assisted Engineering",
    body: "Spec-driven development and agent-assisted delivery — standardizing how a team ships so quality scales past any one person.",
  },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Reveal as="p" className="kicker">
              Des Moines, Iowa · Software Engineer
            </Reveal>
            <Reveal
              as="h1"
              className="text-5xl md:text-6xl font-bold text-navy-900 dark:text-white leading-tight"
            >
              Hi, I&apos;m Adam.
            </Reveal>
            <Reveal
              as="p"
              delay={70}
              className="text-2xl text-navy-700 dark:text-navy-200 font-serif leading-snug"
            >
              I build dependable systems — and the teams that keep them running.
            </Reveal>
            <Reveal
              as="p"
              delay={140}
              className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed max-w-xl"
            >
              Seven-plus years turning messy, high-stakes problems into
              automation, integrations, and applications people can trust. I care
              about the details most people never see — the retry that saves a 2
              a.m. page, the audit trail that passes the review, the onboarding
              doc that ramps a teammate a week faster.
            </Reveal>
            <Reveal delay={210} className="flex flex-wrap gap-2 pt-1">
              {roles.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-navy-300 dark:border-navy-700 bg-navy-100/60 dark:bg-navy-800/60 px-3 py-1 text-sm font-medium text-navy-700 dark:text-navy-200"
                >
                  {r}
                </span>
              ))}
            </Reveal>
            <Reveal delay={280} className="flex flex-wrap gap-4 pt-3">
              <Link
                to="/about"
                className="px-8 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors shadow-sm hover:shadow-md"
              >
                Read my story
              </Link>
              <Link
                to="/resume"
                className="px-8 py-3 bg-navy-100 text-navy-800 dark:bg-navy-800 dark:text-navy-100 rounded-lg font-semibold hover:bg-navy-200 dark:hover:bg-navy-700 transition-colors"
              >
                See my work
              </Link>
            </Reveal>
          </div>
          <Reveal delay={120} className="flex justify-center">
            <div className="relative">
              <div
                className="absolute -inset-3 bg-gradient-to-br from-teal-400 to-gold-400 rounded-full blur-2xl opacity-30"
                aria-hidden="true"
              />
              <img
                src="/profile.jpg"
                alt="Adam Aurelio"
                width="288"
                height="288"
                className="relative w-72 h-72 object-cover rounded-full shadow-2xl ring-4 ring-navy-50 dark:ring-navy-900 transform hover:scale-105 transition-transform"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What I do */}
      <section className="py-20 px-4 md:px-8 bg-navy-100 dark:bg-navy-900 border-y border-navy-200 dark:border-navy-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <Reveal as="p" className="kicker text-center mb-3">
            What I do
          </Reveal>
          <Reveal
            as="h2"
            className="text-4xl font-bold text-center text-navy-900 dark:text-white mb-12"
          >
            Substance over surface
          </Reveal>
          <Reveal delay={80} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatIDo.map(({ title, body }) => (
              <div
                key={title}
                className="bg-navy-50 dark:bg-navy-800 p-7 rounded-xl border border-navy-200 dark:border-navy-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-1 bg-gold-500 rounded-full mb-4" />
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">
                  {title}
                </h3>
                <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* A few honest numbers */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <Reveal as="p" className="kicker text-center mb-3">
          A few honest numbers
        </Reveal>
        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-5xl md:text-6xl font-serif font-bold text-teal-700 dark:text-teal-300">
              <CountUp end={7} suffix="+" />
            </p>
            <p className="text-navy-600 dark:text-navy-300">Years building</p>
          </div>
          <div className="space-y-1">
            <p className="text-5xl md:text-6xl font-serif font-bold text-teal-700 dark:text-teal-300">
              <CountUp end={5} />
            </p>
            <p className="text-navy-600 dark:text-navy-300">Developers I lead</p>
          </div>
          <div className="space-y-1">
            <p className="text-5xl md:text-6xl font-serif font-bold text-teal-700 dark:text-teal-300">
              <CountUp end={3} />
            </p>
            <p className="text-navy-600 dark:text-navy-300">CompTIA certifications</p>
          </div>
          <div className="space-y-1 flex flex-col justify-center">
            <p className="text-xl md:text-2xl font-serif italic text-gold-700 dark:text-gold-300 leading-snug">
              &ldquo;Leave it better than I found it.&rdquo;
            </p>
            <p className="text-navy-600 dark:text-navy-300">My one rule</p>
          </div>
        </Reveal>
      </section>

      {/* Beyond the code */}
      <section className="py-20 px-4 md:px-8 bg-navy-900 dark:bg-navy-950 text-navy-100 border-y border-gold-500/30">
        <Reveal className="max-w-4xl mx-auto text-center space-y-6">
          <p className="kicker !text-gold-300 mb-1">Beyond the code</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            I&apos;m more than a stack of skills
          </h2>
          <p className="text-lg text-navy-200 leading-relaxed">
            Off the clock I coach youth soccer, serve in my church and community,
            and spend my best hours with my family. The same things I value there
            — showing up, doing it right, lifting the people around me — are the
            things I bring to a team.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              to="/about"
              className="px-8 py-3 bg-gold-700 text-white rounded-lg font-semibold hover:bg-gold-800 transition-colors shadow-sm"
            >
              More about me
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-transparent border-2 border-navy-300 text-navy-100 rounded-lg font-semibold hover:bg-navy-100 hover:text-navy-900 transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
