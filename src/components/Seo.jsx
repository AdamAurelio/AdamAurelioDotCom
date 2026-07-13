/* eslint-disable react/prop-types */
// Per-route document metadata. React 19 hoists <title>, <meta>, and <link>
// rendered anywhere in the tree up into <head>, so each page can own its own
// title, description, canonical URL, and social-share tags without a helmet
// library. Structured data (JSON-LD) is emitted as a plain script tag, which
// search engines parse wherever it appears in the document.

const SITE_NAME = "Adam Aurelio";
const BASE_URL = "https://adamaurelio.com";
const DEFAULT_DESCRIPTION =
  "Adam Aurelio — Software Engineer specializing in enterprise automation, " +
  "full-stack development, and Oracle PL/SQL.";

const Seo = ({ title, description = DEFAULT_DESCRIPTION, path = "", jsonLd }) => {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · Software Engineer`;
  const url = `${BASE_URL}${path}`;
  const image = `${BASE_URL}/profile.jpg`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
};

export default Seo;
