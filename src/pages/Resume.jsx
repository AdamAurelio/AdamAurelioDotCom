/* eslint-disable react/prop-types */
import EmailLink from "../components/EmailLink";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import OutboundLink from "../components/OutboundLink";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Icon from "../components/ui/Icon";
import IconBadge from "../components/ui/IconBadge";
import { trackEvent } from "../lib/analytics";
import { site } from "../content/site";
import {
  summary,
  seoDescription,
  highlights,
  skills,
  experience,
  education,
  certifications,
  community,
} from "../content/resume";

const h2Class = "text-3xl font-bold text-navy-900 dark:text-white mb-6";

// Pills that still read as separate items on paper, where backgrounds drop out.
const chipClass =
  "rounded-full bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 text-sm px-3 py-1 print:border print:border-navy-300";

// On paper: cards stay whole and tighter, and their icons drop out to save room.
const printCard = "print:break-inside-avoid print:p-3";

const Chips = ({ items, label }) => (
  <ul className="flex flex-wrap gap-2" aria-label={label}>
    {items.map((item) => (
      <li key={item} className={chipClass}>
        {item}
      </li>
    ))}
  </ul>
);

const BulletList = ({ bullets }) => (
  <ul className="space-y-2 print:space-y-1 text-navy-700 dark:text-navy-300 list-disc list-outside pl-5">
    {bullets.map((b) => (
      <li key={b}>{b}</li>
    ))}
  </ul>
);

const BulletGroup = ({ title, icon, bullets, last }) => (
  <div className={last ? "" : "mb-6 print:mb-3"}>
    {title && (
      <h5 className="flex items-center gap-2 text-sm font-mono font-semibold uppercase tracking-[0.15em] text-gold-700 dark:text-gold-300 mb-2">
        <Icon name={icon} className="h-4 w-4 shrink-0" />
        {title}
      </h5>
    )}
    <BulletList bullets={bullets} />
  </div>
);

// One stop on the career timeline: a briefcase badge sits on the rule drawn by
// the <ol>'s left border.
const Employer = ({ company, location, dates, roles }) => (
  <li className="relative pl-10 print:pl-0 print:break-inside-auto">
    <IconBadge
      name="briefcase"
      className="absolute -left-[1.4rem] top-0 ring-4 ring-white dark:ring-navy-900 print:hidden"
    />
    <div className="flex flex-wrap justify-between items-start gap-x-6 gap-y-2 mb-4">
      <div>
        <h3 className="text-2xl font-bold text-navy-900 dark:text-white">{company}</h3>
        {location && <p className="text-navy-600 dark:text-navy-400">{location}</p>}
      </div>
      <p className="rounded-full bg-teal-100 dark:bg-teal-400/15 px-3 py-1 text-sm font-semibold text-teal-800 dark:text-teal-200">
        {dates}
      </p>
    </div>
    {roles.map(({ title, groups }) => (
      <div key={title}>
        <h4 className="text-xl font-semibold text-navy-800 dark:text-navy-200 mb-4">{title}</h4>
        {groups.map((group, i) => (
          <BulletGroup key={group.title ?? i} {...group} last={i === groups.length - 1} />
        ))}
      </div>
    ))}
  </li>
);

const Resume = () => {
  return (
    <section
      id="resume"
      className="py-12 bg-navy-100 dark:bg-navy-950 min-h-screen transition-colors"
    >
      <Seo
        title="Résumé"
        path="/resume"
        description={seoDescription}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.name,
          jobTitle: site.role,
          url: `${site.baseUrl}/resume`,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Des Moines",
            addressRegion: "IA",
          },
          sameAs: [site.links.linkedin, site.links.github],
        }}
      />
      <Container
        width="content"
        className="bg-white dark:bg-navy-900 shadow-lg rounded-lg py-8 md:py-12 print:shadow-none print:p-0"
      >
        <Reveal
          as="header"
          immediate
          className="mb-12 border-b border-navy-200 dark:border-navy-700 pb-8 print:mb-6 print:pb-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <img
              src={site.images.profile}
              alt={site.name}
              width="128"
              height="128"
              className="w-32 h-32 object-cover rounded-full shadow-md ring-2 ring-gold-300 dark:ring-gold-500/50 shrink-0 print:hidden"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-5xl font-bold text-navy-900 dark:text-white mb-2">
                    {site.name}
                  </h1>
                  <p className="text-xl font-semibold text-teal-700 dark:text-teal-300 mb-3">
                    {site.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("resume_print");
                    window.print();
                  }}
                  className="print:hidden shrink-0 px-4 py-2 text-sm font-semibold rounded-lg border border-navy-300 dark:border-navy-600 text-navy-700 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
                >
                  Print / Save PDF
                </button>
              </div>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-navy-600 dark:text-navy-400 mb-4">
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="map-pin" className="h-4 w-4" />
                  {site.locationShort}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="mail" className="h-4 w-4" />
                  <EmailLink />
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="linkedin" className="h-4 w-4" />
                  <OutboundLink
                    href={site.links.linkedin}
                    label="resume-linkedin"
                    className="text-teal-700 dark:text-teal-300 hover:underline"
                  >
                    {site.links.linkedinDisplay}
                  </OutboundLink>
                </li>
              </ul>
              <p className="text-lg text-navy-700 dark:text-navy-200 leading-relaxed">{summary}</p>
            </div>
          </div>

          <ul aria-label="At a glance" className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {highlights.map(({ value, label }) => (
              <li
                key={label}
                className="rounded-xl bg-navy-100 dark:bg-navy-800 px-2 py-4 text-center print:border print:border-navy-300"
              >
                <p className="text-3xl sm:text-4xl font-serif font-bold text-teal-700 dark:text-teal-300">
                  {value}
                </p>
                <p className="text-sm text-navy-600 dark:text-navy-300">{label}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="mb-12 print:mb-6">
          <h2 className={h2Class}>Core Skills</h2>
          <div className="grid md:grid-cols-2 print:grid-cols-2 gap-6 print:gap-3">
            {skills.map(({ title, icon, items }) => (
              <Card key={title} padding="p-6" className={printCard}>
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <IconBadge name={icon} className="print:hidden" />
                  <h3 className="text-xl font-semibold text-navy-900 dark:text-white">{title}</h3>
                </div>
                <Chips items={items} label={title} />
              </Card>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12 print:mb-6">
          <h2 className={h2Class}>Professional Experience</h2>
          <ol className="ml-5 space-y-10 print:space-y-6 border-l-2 border-teal-600/30 dark:border-teal-400/30 print:ml-0 print:border-l-0">
            {experience.map((employer) => (
              <Employer key={employer.company} {...employer} />
            ))}
          </ol>
        </Reveal>

        <Reveal as="section" className="mb-12 print:mb-6">
          <h2 className={h2Class}>Education &amp; Certifications</h2>
          <div className="grid md:grid-cols-2 print:grid-cols-2 gap-6 print:gap-3">
            {education.map(({ school, location, degree }) => (
              <Card key={school} padding="p-6" className={`flex gap-4 items-start ${printCard}`}>
                <IconBadge name="graduation-cap" className="print:hidden" />
                <div>
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white">{school}</h3>
                  <p className="text-navy-600 dark:text-navy-400">{location}</p>
                  <p className="text-navy-700 dark:text-navy-300">{degree}</p>
                </div>
              </Card>
            ))}
            <Card padding="p-6" className={`flex gap-4 items-start ${printCard}`}>
              <IconBadge name="award" className="print:hidden" />
              <div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">
                  Certifications
                </h3>
                <Chips items={certifications} label="Certifications" />
              </div>
            </Card>
          </div>
        </Reveal>

        <Reveal as="section">
          <h2 className={h2Class}>Leadership &amp; Community</h2>
          <div className="grid md:grid-cols-3 print:grid-cols-3 gap-4 print:gap-3">
            {community.map(({ icon, text }) => (
              <Card key={text} padding="p-5" className={`flex flex-col gap-3 ${printCard}`}>
                <IconBadge name={icon} tone="gold" className="print:hidden" />
                <h3 className="font-bold text-navy-900 dark:text-white">{text}</h3>
              </Card>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
};

export default Resume;
