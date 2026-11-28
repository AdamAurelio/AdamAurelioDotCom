/* eslint-disable react/prop-types */

/**
 * A number whose digits roll into place like a utility meter when the
 * enclosing <Reveal> arrives (.odo in src/styles/index.css). Each digit is a
 * 0–9,0–9 strip that rolls at least ten places; a hidden copy of the final
 * digit sizes its window. Pure CSS motion, so reduced motion and print show
 * the final value with no script involved.
 *
 * The rolling strips are decorative; assistive tech reads the plain value.
 */
const STRIP = Array.from({ length: 20 }, (_, n) => n % 10);

const Odometer = ({ value, suffix = "", index = 0 }) => {
  const digits = String(value).split("");
  return (
    <>
      <span className="sr-only print:not-sr-only">
        {value}
        {suffix}
      </span>
      <span className="odo" aria-hidden="true" style={{ "--i": index }}>
        {digits.map((digit, k) => (
          // Digits of a fixed number never reorder, so position is a stable key.
          <span key={k} className="odo-col">
            <span className="odo-ghost">{digit}</span>
            <span
              className="odo-strip"
              style={{ "--n": 10 + Number(digit), "--dur": `${1.5 + k * 0.4}s` }}
            >
              {STRIP.map((n, i) => (
                <span key={i}>{n}</span>
              ))}
            </span>
          </span>
        ))}
        {suffix && <span className="odo-suffix">{suffix}</span>}
      </span>
    </>
  );
};

export default Odometer;
