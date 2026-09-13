import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Section from "../components/ui/Section";
import ButtonLink from "../components/ui/ButtonLink";
import { site } from "../content/site";
import { seoDescription, values, community } from "../content/about";

const About = () => {
  return (
    <Container width="prose" className="py-16">
      <Seo title="About" path="/about" description={seoDescription} />

      {/* Intro — visible immediately; it's the LCP element. */}
      <Reveal
        as="header"
        immediate
        className="mb-16 flex flex-col sm:flex-row items-center gap-8"
      >
        <img
          src={site.images.profile}
          alt={site.name}
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
            I&apos;m a software engineer in the Des Moines area who&apos;s happiest
            turning something chaotic into something dependable — whether
            that&apos;s a fragile manual process or a team finding its footing.
          </p>
        </div>
      </Reveal>

      <Section kicker="My story" title="From help desk to shipping the platform">
        <div className="space-y-4 text-lg text-navy-700 dark:text-navy-200 leading-relaxed">
          <p>
            I didn&apos;t start with a computer-science pedigree — I started on a
            support desk, resolving the incidents nobody else wanted and learning
            how real systems actually break. That view from the bottom of the
            stack never left me. It&apos;s why I obsess over reliability, and why
            I still think the best engineers are the ones who remember
            there&apos;s a person on the other end of the error message.
          </p>
          <p>
            Over seven-plus years I grew into building the systems I used to
            support: PL/SQL and .NET services behind mission-critical business
            processes, Oracle APEX applications, resilient RPA automations, and
            the access-governance workflows that keep a regulated utility
            compliant. Lately I&apos;ve been pushing into full-stack React,
            Databricks, and cloud — and helping build our company&apos;s
            spec-driven, AI-assisted development practice from the inside: the
            specs, standards, and delivery paths that my team and engineers
            across the enterprise now use. Adopting AI the right way, not just
            the fast way.
          </p>
          <p>
            Somewhere in there I became the person others come to when
            something&apos;s stuck. I lead a small team of developers, I&apos;ve
            stepped in as acting manager through a transition, and I&apos;ve
            written more onboarding plans and incident runbooks than I can count.
            I like that work. Systems are satisfying; people are the point.
          </p>
        </div>
      </Section>

      <Section kicker="What I value" title="Three things I don't compromise on">
        <div className="space-y-5">
          {values.map(({ title, body }) => (
            <Card key={title} accent="teal" padding="px-6 py-5">
              <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-1">{title}</h3>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">{body}</p>
            </Card>
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
            <Card key={role} padding="px-5 py-4" className="flex gap-4 items-start">
              <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-gold-500 shrink-0" />
              <div>
                <h3 className="font-bold text-navy-900 dark:text-white">{role}</h3>
                <p className="text-navy-600 dark:text-navy-300">{body}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Closing */}
      <Reveal className="rounded-xl bg-navy-900 border border-gold-500/30 px-8 py-10 text-center">
        <p className="font-serif text-2xl text-navy-50 mb-3">
          If any of this resonates, let&apos;s talk.
        </p>
        <p className="text-navy-300 mb-6">
          I&apos;m always up for a conversation about hard problems, good teams,
          or building things that last.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <ButtonLink to="/contact" variant="gold">
            Say hello
          </ButtonLink>
          <ButtonLink to="/how-i-work" variant="outlineOnDark">
            How I work
          </ButtonLink>
        </div>
      </Reveal>
    </Container>
  );
};

export default About;
