import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Section from "../components/ui/Section";
import ButtonLink from "../components/ui/ButtonLink";
import IconBadge from "../components/ui/IconBadge";
import { site } from "../content/site";
import {
  seoDescription,
  intro,
  path,
  values,
  communityIntro,
  community,
} from "../content/about";

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
          <p className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed">{intro}</p>
        </div>
      </Reveal>

      <Section kicker="My path" title="From help desk to team lead">
        <ol className="relative border-l-2 border-teal-600/30 dark:border-teal-400/30 ml-5 space-y-8">
          {path.map(({ icon, when, title, body }) => (
            <li key={title} className="relative pl-10">
              <IconBadge
                name={icon}
                className="absolute -left-[1.4rem] top-0 ring-4 ring-navy-50 dark:ring-navy-950"
              />
              <p className="kicker mb-1">{when}</p>
              <h3 className="text-xl font-bold text-navy-900 dark:text-white">{title}</h3>
              <p className="text-navy-600 dark:text-navy-300">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section kicker="What I value" title="Three things I don't compromise on">
        <div className="grid sm:grid-cols-3 gap-5">
          {values.map(({ icon, title, body }) => (
            <Card key={title} padding="p-6">
              <IconBadge name={icon} className="mb-4" />
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">{title}</h3>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section kicker="Beyond the code" title="Where my time goes">
        <p className="text-lg text-navy-700 dark:text-navy-200 mb-6">{communityIntro}</p>
        <div className="space-y-3">
          {community.map(({ icon, name, role }) => (
            <Card key={name} padding="px-5 py-4" className="flex gap-4 items-center">
              <IconBadge name={icon} tone="gold" />
              <div>
                <h3 className="font-bold text-navy-900 dark:text-white">{name}</h3>
                <p className="text-navy-600 dark:text-navy-300">{role}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Closing */}
      <Reveal className="rounded-xl bg-navy-900 border border-gold-500/30 px-8 py-10 text-center">
        <p className="font-serif text-2xl text-navy-50 mb-6">Want to talk shop?</p>
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
