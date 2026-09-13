import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import Container from "../components/ui/Container";
import PageHeader from "../components/ui/PageHeader";
import ButtonLink from "../components/ui/ButtonLink";
import { principles, seoDescription } from "../content/howIWork";

const HowIWork = () => {
  return (
    <Container width="prose" className="py-16">
      <Seo title="How I Work" path="/how-i-work" description={seoDescription} />

      <PageHeader
        kicker="How I work"
        title="The principles behind the pull requests"
        lede="Tools change every couple of years; how you think about building doesn't. These are the convictions I bring to a team — earned from regulated systems where getting it wrong is expensive."
      />

      <div className="space-y-8">
        {principles.map(({ n, title, body }) => (
          <Reveal
            key={n}
            as="article"
            className="flex gap-5 border-b border-navy-200 dark:border-navy-800 pb-8"
          >
            <span
              className="font-mono text-2xl font-bold text-gold-600 dark:text-gold-400 shrink-0"
              aria-hidden="true"
            >
              {n}
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-navy-900 dark:text-white mb-2">
                {title}
              </h2>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 text-center">
        <p className="text-navy-600 dark:text-navy-300 mb-5">
          Curious how these show up in real work?
        </p>
        <ButtonLink to="/resume">See the résumé</ButtonLink>
      </Reveal>
    </Container>
  );
};

export default HowIWork;
