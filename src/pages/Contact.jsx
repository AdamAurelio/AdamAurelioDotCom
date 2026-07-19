import Reveal from "../components/Reveal";
import EmailLink from "../components/EmailLink";
import Seo from "../components/Seo";

// NOTE: verify this GitHub username before shipping.
const GITHUB_URL = "https://github.com/adamaurelio";
const LINKEDIN_URL = "https://linkedin.com/in/adamaurelio";

const channels = [
  {
    label: "Email",
    detail: <EmailLink />,
    note: "Best for anything substantive — I read everything.",
  },
  {
    label: "LinkedIn",
    detail: (
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-700 dark:text-teal-300 hover:underline"
      >
        linkedin.com/in/adamaurelio
      </a>
    ),
    note: "Connect, or reach out about a role or collaboration.",
  },
  {
    label: "GitHub",
    detail: (
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-700 dark:text-teal-300 hover:underline"
      >
        github.com/adamaurelio
      </a>
    ),
    note: "Code, this site, and the occasional experiment.",
  },
];

const Contact = () => {
  return (
    <div className="py-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Seo
          title="Contact"
          path="/contact"
          description="Get in touch with Adam Aurelio — software engineer in the Des Moines, Iowa area. Email, LinkedIn, or GitHub."
        />
        <Reveal as="header" className="mb-12 text-center">
          <p className="kicker mb-2">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-4">
            Let&apos;s talk
          </h1>
          <p className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed">
            Whether it&apos;s a role, a hard problem, or just comparing notes on
            reliability and good teams — I&apos;d genuinely like to hear from
            you. I&apos;m based in the Des Moines, Iowa area and reply to real
            messages.
          </p>
        </Reveal>

        <Reveal className="space-y-4">
          {channels.map(({ label, detail, note }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 rounded-lg px-6 py-5"
            >
              <div>
                <p className="kicker mb-1">{label}</p>
                <p className="text-lg text-navy-900 dark:text-white">{detail}</p>
              </div>
              <p className="text-sm text-navy-600 dark:text-navy-400 sm:text-right sm:max-w-[16rem]">
                {note}
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 text-center text-navy-600 dark:text-navy-400">
          <p className="font-serif italic text-lg">
            &ldquo;The best time to reach out is when you have something real to
            say. The second best time is now.&rdquo;
          </p>
        </Reveal>
      </div>
    </div>
  );
};

export default Contact;
