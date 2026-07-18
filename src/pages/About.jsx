/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

const values = [
  {
    title: "Do it right, even when no one's looking",
    body: "The retry logic, the audit trail, the test nobody asked for. Quality lives in the details you don't get credit for — so I build like someone will have to maintain it at 2 a.m. (often that someone is me).",
  },
  {
    title: "Earn trust, then keep it",
    body: "I've spent years in access governance and security, where trust is the whole job. I say what's done and what isn't, I flag risk early, and I don't dress up a demo as a deployment.",
  },
  {
    title: "Lift the people around you",
    body: "The work I'm proudest of usually has someone else's name on the commit. Mentoring, onboarding, unblocking — a team that's better than the sum of its people is the real deliverable.",
  },
];

const community = [
  {
    role: "Coach — Iowa United Select 14U Girls",
    body: "Teaching kids that effort and composure beat talent on a bad day.",
  },
  {
    role: "Director of Volunteers — Prior Iowa Asian Alliance",
    body: "Organizing people around service and celebrating the community and heritage I come from.",
  },
  {
    role: "A/V Team Lead — Walnut Creek Community Church",
    body: "Faith and family are the foundation I build everything else on; serving on the tech team is one small way I give back.",
  },
];

const Section = ({ kicker, title, children }) => (
  <Reveal as="section" className="mb-16">
    <p className="kicker mb-2">{kicker}</p>
    <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-5">
      {title}
    </h2>
    {children}
  </Reveal>
);

const About = () => {
  return (
    <div className="py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Intro */}
        <Reveal as="header" className="mb-16 flex flex-col sm:flex-row items-center gap-8">
          <img
            src="/profile.jpg"
            alt="Adam Aurelio"
            width="144"
            height="144"
            className="w-36 h-36 object-cover rounded-full shadow-lg ring-2 ring-gold-300 dark:ring-gold-500/50 shrink-0"
          />
          <div>
            <p className="kicker mb-2">About me</p>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-3">
              Engineer, leader, coach.
            </h1>
            <p className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed">
              I&apos;m a software engineer in the Des Moines area who&apos;s
              happiest turning something chaotic into something dependable —
              whether that&apos;s a fragile manual process or a team finding its
              footing.
            </p>
          </div>
        </Reveal>

        <Section kicker="My story" title="From help desk to shipping the platform">
          <div className="space-y-4 text-lg text-navy-700 dark:text-navy-200 leading-relaxed">
            <p>
              I didn&apos;t start with a computer-science pedigree — I started on
              a support desk, resolving the incidents nobody else wanted and
              learning how real systems actually break. That view from the
              bottom of the stack never left me. It&apos;s why I obsess over
              reliability, and why I still think the best engineers are the ones
              who remember there&apos;s a person on the other end of the error
              message.
            </p>
            <p>
              Over seven-plus years I grew into building the systems I used to
              support: PL/SQL and .NET services behind mission-critical business
              processes, Oracle APEX applications, resilient RPA automations, and
              the access-governance workflows that keep a regulated utility
              compliant. Lately I&apos;ve been pushing into full-stack React,
              Databricks, and cloud — and helping build our company&apos;s
              spec-driven, AI-assisted development practice from the inside:
              the specs, standards, and delivery paths that my team and
              engineers across the enterprise now use. Adopting AI the right
              way, not just the fast way.
            </p>
            <p>
              Somewhere in there I became the person others come to when
              something&apos;s stuck. I lead a small team of developers, I&apos;ve
              stepped in as acting manager through a transition, and I&apos;ve
              written more onboarding plans and incident runbooks than I can
              count. I like that work. Systems are satisfying; people are the
              point.
            </p>
          </div>
        </Section>

        <Section kicker="What I value" title="Three things I don't compromise on">
          <div className="space-y-5">
            {values.map(({ title, body }) => (
              <div
                key={title}
                className="border-l-4 border-teal-600 dark:border-teal-400 bg-navy-100/70 dark:bg-navy-900/70 rounded-r-lg px-6 py-5"
              >
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-1">
                  {title}
                </h3>
                <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section kicker="Beyond the code" title="Where my time really goes">
          <p className="text-lg text-navy-700 dark:text-navy-200 leading-relaxed mb-6">
            The values above didn&apos;t come from a standup. They come from the
            rest of my life — my faith, my family, and the communities I&apos;m
            lucky to serve. These are the commitments that keep the work in
            perspective.
          </p>
          <div className="space-y-4">
            {community.map(({ role, body }) => (
              <div
                key={role}
                className="flex gap-4 items-start bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 rounded-lg px-5 py-4"
              >
                <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-gold-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-navy-900 dark:text-white">
                    {role}
                  </h3>
                  <p className="text-navy-600 dark:text-navy-300">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Closing */}
        <Reveal className="rounded-xl bg-navy-900 dark:bg-navy-900 border border-gold-500/30 px-8 py-10 text-center">
          <p className="font-serif text-2xl text-navy-50 mb-3">
            If any of this resonates, let&apos;s talk.
          </p>
          <p className="text-navy-300 mb-6">
            I&apos;m always up for a conversation about hard problems, good
            teams, or building things that last.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-gold-700 text-white rounded-lg font-semibold hover:bg-gold-800 transition-colors"
            >
              Say hello
            </Link>
            <Link
              to="/how-i-work"
              className="px-8 py-3 border-2 border-navy-500 text-navy-100 rounded-lg font-semibold hover:bg-navy-100 hover:text-navy-900 transition-colors"
            >
              How I work
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default About;
