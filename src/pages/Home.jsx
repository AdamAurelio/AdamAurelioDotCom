import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import Seo from "../components/Seo";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import ButtonLink from "../components/ui/ButtonLink";
import { site } from "../content/site";
import { roles, intro, whatIDo, numbers, oneRule, beyond } from "../content/home";

const Home = () => {
  return (
    <div>
      <Seo path="/" />

      {/* Hero — rendered visible immediately; it is the LCP element. */}
      <Container as="section" className="py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal immediate className="space-y-6">
            <p className="kicker">
              {site.location} · {site.role}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-navy-900 dark:text-white leading-tight">
              Hi, I&apos;m Adam.
            </h1>
            <p className="text-2xl text-navy-700 dark:text-navy-200 font-serif leading-snug">
              {site.tagline}
            </p>
            <p className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed max-w-xl">
              {intro}
            </p>
            <ul className="flex flex-wrap gap-2 pt-1" aria-label="Roles">
              {roles.map((r) => (
                <li
                  key={r}
                  className="rounded-full border border-navy-300 dark:border-navy-700 bg-navy-100/60 dark:bg-navy-800/60 px-3 py-1 text-sm font-medium text-navy-700 dark:text-navy-200"
                >
                  {r}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 pt-3">
              <ButtonLink to="/about">Read my story</ButtonLink>
              <ButtonLink to="/projects" variant="secondary">
                See my projects
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal immediate className="flex justify-center">
            <div className="relative">
              <div
                className="absolute -inset-3 bg-gradient-to-br from-teal-400 to-gold-400 rounded-full blur-2xl opacity-30"
                aria-hidden="true"
              />
              <img
                src={site.images.profile}
                alt={site.name}
                width="288"
                height="288"
                fetchPriority="high"
                className="relative w-72 h-72 object-cover rounded-full shadow-2xl ring-4 ring-navy-50 dark:ring-navy-900 transform hover:scale-105 transition-transform"
              />
            </div>
          </Reveal>
        </div>
      </Container>

      {/* What I do */}
      <section className="py-20 bg-navy-100 dark:bg-navy-900 border-y border-navy-200 dark:border-navy-800 transition-colors">
        <Container>
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
              <Card key={title} interactive>
                <div className="w-10 h-1 bg-gold-500 rounded-full mb-4" />
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">{title}</h3>
                <p className="text-navy-600 dark:text-navy-300 leading-relaxed">{body}</p>
              </Card>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* A few honest numbers */}
      <Container as="section" className="py-20">
        <Reveal as="p" className="kicker text-center mb-3">
          A few honest numbers
        </Reveal>
        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {numbers.map(({ value, suffix, label }) => (
            <div key={label} className="space-y-1">
              <p className="text-5xl md:text-6xl font-serif font-bold text-teal-700 dark:text-teal-300">
                <CountUp end={value} suffix={suffix} />
              </p>
              <p className="text-navy-600 dark:text-navy-300">{label}</p>
            </div>
          ))}
          <div className="space-y-1 flex flex-col justify-center">
            <p className="text-xl md:text-2xl font-serif italic text-gold-700 dark:text-gold-300 leading-snug">
              &ldquo;{oneRule.quote}&rdquo;
            </p>
            <p className="text-navy-600 dark:text-navy-300">{oneRule.label}</p>
          </div>
        </Reveal>
      </Container>

      {/* Beyond the code — a warm paper band in light mode so the page does not
          end in two stacked navy blocks (this + the footer). */}
      <section className="py-20 bg-gold-50 dark:bg-navy-900 border-y border-gold-200 dark:border-gold-500/30 transition-colors">
        <Container width="wide">
          <Reveal className="max-w-3xl mx-auto text-center space-y-6">
            <p className="kicker mb-1">{beyond.kicker}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white">
              {beyond.title}
            </h2>
            <p className="text-lg text-navy-700 dark:text-navy-200 leading-relaxed">
              {beyond.body}
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <ButtonLink to="/about" variant="gold">
                More about me
              </ButtonLink>
              <ButtonLink to="/contact" variant="outline">
                Get in touch
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
};

export default Home;
