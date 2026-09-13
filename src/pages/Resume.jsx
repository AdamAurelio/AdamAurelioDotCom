/* eslint-disable react/prop-types */
import EmailLink from "../components/EmailLink";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import OutboundLink from "../components/OutboundLink";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import { trackEvent } from "../lib/analytics";
import { site } from "../content/site";
import {
  summary,
  seoDescription,
  skills,
  experience,
  education,
  certifications,
  community,
} from "../content/resume";

const h2Class = "text-3xl font-bold text-navy-900 dark:text-white mb-6";

const BulletList = ({ bullets, className = "" }) => (
  <ul
    className={`space-y-2 text-navy-700 dark:text-navy-300 list-disc list-outside pl-5 ${className}`}
  >
    {bullets.map((b) => (
      <li key={b}>{b}</li>
    ))}
  </ul>
);

const BulletGroup = ({ title, bullets, last }) => (
  <>
    {title && (
      <h5 className="text-sm font-mono font-semibold uppercase tracking-[0.15em] text-gold-700 dark:text-gold-300 mb-2">
        {title}
      </h5>
    )}
    <BulletList bullets={bullets} className={last ? "" : "mb-6"} />
  </>
);

const Employer = ({ company, location, dates, roles }) => (
  <Card accent="teal" padding="px-6 py-5" className="mb-8">
    <div className="flex flex-wrap justify-between items-start gap-x-6 gap-y-1 mb-4">
      <div>
        <h3 className="text-2xl font-bold text-navy-900 dark:text-white">{company}</h3>
        {location && <p className="text-navy-600 dark:text-navy-400">{location}</p>}
      </div>
      <p className="text-navy-600 dark:text-navy-400 font-medium">{dates}</p>
    </div>
    {roles.map(({ title, groups }) => (
      <div key={title}>
        <h4 className="text-xl font-semibold text-navy-800 dark:text-navy-200 mb-4">{title}</h4>
        {groups.map((group, i) => (
          <BulletGroup key={group.title ?? i} {...group} last={i === groups.length - 1} />
        ))}
      </div>
    ))}
  </Card>
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
          className="mb-12 border-b border-navy-200 dark:border-navy-700 pb-8 flex flex-col sm:flex-row items-center gap-8"
        >
          <img
            src={site.images.profile}
            alt={site.name}
            width="128"
            height="128"
            className="w-32 h-32 object-cover rounded-full shadow-md ring-2 ring-gold-300 dark:ring-gold-500/50 shrink-0"
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
            <p className="text-sm text-navy-600 dark:text-navy-400 mb-4">
              {site.locationShort} · <EmailLink /> ·{" "}
              <OutboundLink
                href={site.links.linkedin}
                label="resume-linkedin"
                className="text-teal-700 dark:text-teal-300 hover:underline"
              >
                {site.links.linkedinDisplay}
              </OutboundLink>
            </p>
            <p className="text-lg text-navy-700 dark:text-navy-200 leading-relaxed">{summary}</p>
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className={h2Class}>Core Skills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map(({ title, body }) => (
              <Card key={title} padding="p-6">
                <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-navy-700 dark:text-navy-300">{body}</p>
              </Card>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className={h2Class}>Professional Experience</h2>
          {experience.map((employer) => (
            <Employer key={employer.company} {...employer} />
          ))}
        </Reveal>

        <Reveal as="section" className="mb-12">
          <h2 className={h2Class}>Education &amp; Certifications</h2>

          {education.map(({ school, location, degree }) => (
            <Card key={school} padding="p-6" className="mb-6">
              <h3 className="text-xl font-bold text-navy-900 dark:text-white">{school}</h3>
              <p className="text-navy-600 dark:text-navy-400">{location}</p>
              <p className="text-navy-700 dark:text-navy-300">{degree}</p>
            </Card>
          ))}

          <Card padding="p-6">
            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-4">
              Certifications
            </h3>
            <BulletList bullets={certifications} />
          </Card>
        </Reveal>

        <Reveal as="section">
          <h2 className={h2Class}>Leadership &amp; Community</h2>
          {community.map((item) => (
            <Card key={item} accent="gold" padding="px-6 py-4" className="mb-4">
              <h3 className="text-lg font-bold text-navy-900 dark:text-white">{item}</h3>
            </Card>
          ))}
        </Reveal>
      </Container>
    </section>
  );
};

export default Resume;
