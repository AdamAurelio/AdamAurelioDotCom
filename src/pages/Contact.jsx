import Reveal from "../components/Reveal";
import EmailLink from "../components/EmailLink";
import OutboundLink from "../components/OutboundLink";
import Seo from "../components/Seo";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { site } from "../content/site";

const linkClass = "text-teal-700 dark:text-teal-300 hover:underline";

const channels = [
  {
    label: "Email",
    detail: <EmailLink />,
    note: "Best for anything substantive — I read everything.",
  },
  {
    label: "LinkedIn",
    detail: (
      <OutboundLink href={site.links.linkedin} label="contact-linkedin" className={linkClass}>
        {site.links.linkedinDisplay}
      </OutboundLink>
    ),
    note: "Connect, or reach out about a role or collaboration.",
  },
  {
    label: "GitHub",
    detail: (
      <OutboundLink href={site.links.github} label="contact-github" className={linkClass}>
        {site.links.githubDisplay}
      </OutboundLink>
    ),
    note: "Code, this site, and the occasional experiment.",
  },
];

const Contact = () => {
  return (
    <Container width="narrow" className="py-16">
      <Seo
        title="Contact"
        path="/contact"
        description={`Get in touch with ${site.name} — software engineer in the ${site.location} area. Email, LinkedIn, or GitHub.`}
      />

      <PageHeader
        kicker="Contact"
        title="Let's talk"
        align="center"
        className="mb-12"
        lede={`Whether it's a role, a hard problem, or just comparing notes on reliability and good teams — I'd genuinely like to hear from you. I'm based in the ${site.location} area and reply to real messages.`}
      />

      <Reveal className="space-y-4">
        {channels.map(({ label, detail, note }) => (
          <Card
            key={label}
            padding="px-6 py-5"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
          >
            <div>
              <p className="kicker mb-1">{label}</p>
              <p className="text-lg text-navy-900 dark:text-white">{detail}</p>
            </div>
            <p className="text-sm text-navy-600 dark:text-navy-400 sm:text-right sm:max-w-[16rem]">
              {note}
            </p>
          </Card>
        ))}
      </Reveal>

      <Reveal className="mt-10 text-center text-navy-600 dark:text-navy-400">
        <p className="font-serif italic text-lg">
          &ldquo;The best time to reach out is when you have something real to
          say. The second best time is now.&rdquo;
        </p>
      </Reveal>
    </Container>
  );
};

export default Contact;
