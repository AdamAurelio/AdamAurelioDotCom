import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";

const principles = [
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

const HowIWork = () => {
  return (
    <div className="py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Seo
          title="How I Work"
          path="/how-i-work"
          description="The engineering principles behind Adam Aurelio's work: reliability by design, observability, source-controlled specs, and honest status."
        />
        <Reveal as="header" className="mb-14">
          <p className="kicker mb-2">How I work</p>
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-4">
            The principles behind the pull requests
          </h1>
          <p className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed">
            Tools change every couple of years; how you think about building
            doesn&apos;t. These are the convictions I bring to a team — earned
            from regulated systems where getting it wrong is expensive.
          </p>
        </Reveal>

        <div className="space-y-8">
          {principles.map(({ n, title, body }) => (
            <Reveal
              key={n}
              as="article"
              className="flex gap-5 border-b border-navy-200 dark:border-navy-800 pb-8"
            >
              <span className="font-mono text-2xl font-bold text-gold-500 dark:text-gold-400 shrink-0">
                {n}
              </span>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-navy-900 dark:text-white mb-2">
                  {title}
                </h2>
                <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="text-navy-600 dark:text-navy-300 mb-5">
            Curious how these show up in real work?
          </p>
          <Link
            to="/resume"
            className="px-8 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors inline-block"
          >
            See the résumé
          </Link>
        </Reveal>
      </div>
    </div>
  );
};

export default HowIWork;
