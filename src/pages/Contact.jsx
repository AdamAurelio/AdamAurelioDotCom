import Reveal from "../components/Reveal";
import EmailLink from "../components/EmailLink";
import OutboundLink from "../components/OutboundLink";
import Seo from "../components/Seo";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import IconBadge from "../components/ui/IconBadge";
import { site } from "../content/site";

const linkClass = "text-teal-700 dark:text-teal-300 hover:underline";

const channels = [
  {
    label: "Email",
    icon: "mail",
    detail: <EmailLink />,
    note: "The best way to reach me.",
  },
  {
    label: "LinkedIn",
    icon: "linkedin",
    detail: (
      <OutboundLink href={site.links.linkedin} label="contact-linkedin" className={linkClass}>
        {site.links.linkedinDisplay}
      </OutboundLink>
    ),
    note: "Roles and collaborations.",
  },
  {
    label: "GitHub",
    icon: "github",
    detail: (
      <OutboundLink href={site.links.github} label="contact-github" className={linkClass}>
        {site.links.githubDisplay}
      </OutboundLink>
    ),
    note: "Code and side projects.",
  },
];

const Contact = () => {
  return (
    <Container width="content" className="py-16">
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
        lede="A role, a tough problem, or just comparing notes — I'd love to hear from you."
      />

      <Reveal className="grid lg:grid-cols-3 gap-6">
        {channels.map(({ label, icon, detail, note }) => (
          <Card key={label} padding="p-6" className="flex flex-col items-center text-center gap-3">
            <IconBadge name={icon} size="lg" />
            <h2 className="text-xl font-bold text-navy-900 dark:text-white">{label}</h2>
            <p className="text-navy-900 dark:text-white">{detail}</p>
            <p className="text-sm text-navy-600 dark:text-navy-400">{note}</p>
          </Card>
        ))}
      </Reveal>
    </Container>
  );
};

export default Contact;
