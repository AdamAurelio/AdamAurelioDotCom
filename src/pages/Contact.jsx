import EmailLink from "../components/EmailLink";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-20 px-4 md:px-8 max-w-3xl mx-auto"
    >
      <Seo
        title="Contact"
        path="/contact"
        description="Get in touch with Adam Aurelio — software engineer in the Des Moines, Iowa area. Reach out by email or connect on LinkedIn."
      />

      <Reveal
        as="h1"
        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Get in Touch
      </Reveal>
      <Reveal
        as="p"
        delay={70}
        className="text-lg text-gray-600 dark:text-gray-400 mb-10"
      >
        I&apos;m always glad to talk about interesting problems, new
        opportunities, or just to connect with fellow engineers. The quickest
        way to reach me is email or LinkedIn.
      </Reveal>

      <Reveal className="space-y-4">
        <a
          href="mailto:adam.aurelio@gmail.com"
          className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all"
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 5L2 7" />
            </svg>
          </span>
          <span>
            <span className="block font-semibold text-gray-900 dark:text-white">
              Email
            </span>
            <span className="block text-gray-600 dark:text-gray-400">
              <EmailLink />
            </span>
          </span>
        </a>

        <a
          href="https://linkedin.com/in/adamaurelio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all"
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V23h-4V8z" />
            </svg>
          </span>
          <span>
            <span className="block font-semibold text-gray-900 dark:text-white">
              LinkedIn
            </span>
            <span className="block text-gray-600 dark:text-gray-400">
              linkedin.com/in/adamaurelio
            </span>
          </span>
        </a>

        <div className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span>
            <span className="block font-semibold text-gray-900 dark:text-white">
              Location
            </span>
            <span className="block text-gray-600 dark:text-gray-400">
              West Des Moines, Iowa
            </span>
          </span>
        </div>
      </Reveal>
    </section>
  );
};

export default Contact;
