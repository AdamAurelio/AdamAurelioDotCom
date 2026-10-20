import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import ButtonLink from "../components/ui/ButtonLink";
import IconBadge from "../components/ui/IconBadge";
import { principles, seoDescription } from "../content/howIWork";

const HowIWork = () => {
  return (
    <Container width="content" className="py-16">
      <Seo title="How I Work" path="/how-i-work" description={seoDescription} />

      <PageHeader
        kicker="How I work"
        title="What I believe about building software"
        lede="Tools change. These don't."
        className="mb-12"
      />

      <Reveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map(({ icon, title, body }) => (
          <Card key={title} as="article" padding="p-6">
            <IconBadge name={icon} size="lg" className="mb-4" />
            <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">{title}</h2>
            <p className="text-navy-600 dark:text-navy-300 leading-relaxed">{body}</p>
          </Card>
        ))}
      </Reveal>

      <Reveal className="mt-14 text-center">
        <p className="text-navy-600 dark:text-navy-300 mb-5">See them in action.</p>
        <ButtonLink to="/resume">See the résumé</ButtonLink>
      </Reveal>
    </Container>
  );
};

export default HowIWork;
