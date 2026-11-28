/* eslint-disable react/prop-types */
import Reveal from "../components/Reveal";
import Odometer from "../components/Odometer";
import LocalTime from "../components/LocalTime";
import Seo from "../components/Seo";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import ButtonLink from "../components/ui/ButtonLink";
import Icon from "../components/ui/Icon";
import IconBadge from "../components/ui/IconBadge";
import { site } from "../content/site";
import { roles, intro, whatIDo, numbers, oneRule, beyond } from "../content/home";

// A soft wash of dawn light behind a section. Each orb is a class string
// (position, size, and a radial gradient of one wash colour).
const Wash = ({ orbs }) => (
  <div className="wash" aria-hidden="true">
    {orbs.map((orb) => (
      <i key={orb} className={orb} />
    ))}
  </div>
);
const teal = "bg-[radial-gradient(closest-side,var(--w-teal),transparent)]";
const gold = "bg-[radial-gradient(closest-side,var(--w-gold),transparent)]";

// Text that rises from behind a mask when its Reveal arrives.
const Masked = ({ children }) => (
  <span className="mask">
    <span>{children}</span>
  </span>
);

// A chapter opening: Roman numeral, heading, and the leaded-glass diamond.
// `kicker` renders the title as a small mono label instead of an h2.
const ChapterHead = ({ numeral, title, kicker = false, ornament = !kicker, className = "" }) => (
  <div className={`text-center ${className}`}>
    <p className="numeral" aria-hidden="true">
      <Masked>{numeral}</Masked>
    </p>
    {kicker ? (
      <p className="kicker">
        <Masked>{title}</Masked>
      </p>
    ) : (
      <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.012em] text-navy-900 dark:text-white">
        <Masked>{title}</Masked>
      </h2>
    )}
    {ornament && <span className="ornament" aria-hidden="true" />}
  </div>
);

// "Leave it better than I found it." with the highlighter under one word.
const Highlighted = ({ text, word }) => {
  const at = word ? text.indexOf(word) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="hl">{word}</span>
      {text.slice(at + word.length)}
    </>
  );
};

const Home = () => {
  return (
    <div>
      <Seo path="/" />

      {/* Hero — rendered visible immediately; it is the LCP element. Only the
          decoration around the text animates. */}
      <Container as="section" className="pt-16 pb-20 md:pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal immediate className="space-y-6">
            <p className="kicker">
              {site.location} · {site.role}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-[-0.022em] text-navy-900 dark:text-white leading-tight">
              Hi, I&apos;m Adam.
            </h1>
            <p className="text-2xl text-navy-700 dark:text-navy-200 font-serif leading-snug">
              {site.tagline}
            </p>
            <p className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed max-w-xl">
              {intro}
            </p>
            <ul className="flex flex-wrap gap-2 pt-1" aria-label="Roles">
              {roles.map(({ label, icon }) => (
                <li
                  key={label}
                  className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-navy-700 dark:text-navy-200"
                >
                  <Icon name={icon} className="h-4 w-4 text-teal-700 dark:text-teal-300" />
                  {label}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 pt-3">
              <ButtonLink to="/about">My story</ButtonLink>
              <ButtonLink to="/projects" variant="secondary">
                See projects
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal immediate className="flex justify-center">
            {/* The photo on a paper disc, inside a gold ring that draws once
                and holds still, with Des Moines' local time on a glass plaque. */}
            <div className="relative h-72 w-72">
              <div
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-full bg-[var(--disc)] transition-colors"
                aria-hidden="true"
              />
              <svg
                className="p-ring absolute -inset-[1.6rem] h-[calc(100%+3.2rem)] w-[calc(100%+3.2rem)]"
                viewBox="0 0 100 100"
                aria-hidden="true"
                focusable="false"
              >
                <circle className="arc" cx="50" cy="50" r="48.5" pathLength="1" />
                <circle className="pip" cx="98.5" cy="50" r="1.6" />
              </svg>
              <img
                src={site.images.profile}
                alt={site.name}
                width="288"
                height="288"
                fetchPriority="high"
                className="relative w-72 h-72 object-cover rounded-full shadow-2xl ring-4 ring-navy-50 dark:ring-navy-950"
              />
              <div className="glass absolute -right-3 min-[481px]:-right-[3.25rem] -bottom-6 z-[2] rounded-2xl px-[0.95rem] py-3">
                <p className="flex items-center gap-2 whitespace-nowrap text-[0.85rem] font-medium text-navy-900 dark:text-navy-100">
                  <span className="status-dot" aria-hidden="true" />
                  Des Moines
                  <span className="text-navy-600 dark:text-navy-300" aria-hidden="true">
                    ·
                  </span>
                  <LocalTime />
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* I. What I do */}
      <section className="band-cool relative py-20">
        <Wash
          orbs={[
            `left-[-12%] top-[8%] h-[34rem] w-[50rem] ${teal}`,
            `right-[-10%] bottom-[-12%] h-[32rem] w-[46rem] ${gold}`,
          ]}
        />
        <Container className="relative">
          <Reveal shell>
            <ChapterHead numeral="I" title="What I do" className="mb-12" />
          </Reveal>
          <Reveal shell className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatIDo.map(({ icon, title, body }, i) => (
              <div key={title} className="reveal-cell min-w-0" style={{ "--i": i }}>
                <Card className="h-full flex gap-4 sm:block">
                  <span
                    className="absolute top-[1.1rem] right-5 font-mono text-[0.7rem] font-medium leading-none tracking-[0.15em] text-navy-600 dark:text-navy-300"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <IconBadge name={icon} size="lg" draw className="sm:mb-4" />
                  <div>
                    <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-navy-600 dark:text-navy-300 leading-relaxed">{body}</p>
                  </div>
                </Card>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* II. A few honest numbers */}
      <section className="relative">
        <Wash
          orbs={[
            `left-[6%] top-[18%] h-[24rem] w-[40rem] ${gold}`,
            `right-[4%] top-[28%] h-[22rem] w-[36rem] ${teal}`,
          ]}
        />
        <Container className="relative py-20">
          <Reveal shell>
            <ChapterHead numeral="II" title="By the numbers" kicker className="mb-7" />
          </Reveal>
          <Reveal
            shell
            className="glass grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-x-0 rounded-3xl px-5 py-9 md:px-2 md:py-10 text-center"
          >
            {numbers.map(({ value, suffix, label }, i) => (
              <div
                key={label}
                className="reveal-cell space-y-1 md:px-4 md:border-l md:border-[color:var(--hairline)] md:first:border-l-0"
                style={{ "--i": i }}
              >
                <p className="text-5xl md:text-6xl font-serif font-bold leading-none text-teal-700 dark:text-teal-300">
                  <Odometer value={value} suffix={suffix} index={i} />
                </p>
                <p className="text-navy-600 dark:text-navy-300">{label}</p>
              </div>
            ))}
            <div
              className="reveal-cell space-y-1 flex flex-col justify-center md:px-4 md:border-l md:border-[color:var(--hairline)]"
              style={{ "--i": numbers.length }}
            >
              <p className="text-xl md:text-2xl font-serif italic text-gold-700 dark:text-gold-300 leading-snug">
                &ldquo;
                <Highlighted text={oneRule.quote} word={oneRule.highlight} />
                &rdquo;
              </p>
              <p className="text-navy-600 dark:text-navy-300">{oneRule.label}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* III. Life outside the code — a warm band rising out of rolling hills.
          It runs on under the footer's horizon (the negative bottom margin
          cancels main's footer padding), so the page ends in one landscape. */}
      <section className="band-warm relative -mb-16 pt-32 pb-36">
        <svg
          className="absolute left-0 top-0 h-[5.6rem] w-full"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path className="hill-back" d="M0 46C160 18 330 22 520 38S860 8 1060 26 1330 48 1440 22V90H0Z" />
          <path className="hill-mid" d="M0 64C220 40 440 56 660 52S1020 34 1220 52 1390 62 1440 50V90H0Z" />
          <path className="hill-ridge" d="M0 64C220 40 440 56 660 52S1020 34 1220 52 1390 62 1440 50" />
          <path className="hill-front" d="M0 80C260 68 520 76 760 72S1180 64 1440 76V90H0Z" />
        </svg>
        <Container width="wide" className="relative">
          <Reveal shell className="max-w-3xl mx-auto text-center space-y-8">
            <ChapterHead numeral="III" title={beyond.title} />
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {beyond.items.map(({ icon, label }, i) => (
                <li
                  key={label}
                  className="reveal-cell flex flex-col items-center gap-3"
                  style={{ "--i": i + 1 }}
                >
                  <IconBadge name={icon} tone="gold" size="lg" shape="arch" draw />
                  <span className="font-medium text-navy-800 dark:text-navy-100">{label}</span>
                </li>
              ))}
            </ul>
            <div className="reveal-tail flex flex-wrap gap-4 justify-center pt-2">
              <ButtonLink to="/about" variant="gold">
                More about me
              </ButtonLink>
              <ButtonLink to="/contact" variant="outline">
                Say hi
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
};

export default Home;
