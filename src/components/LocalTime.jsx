/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  hour: "numeric",
  minute: "2-digit",
});

const now = () => `${format.format(new Date())} CT`;

/**
 * The current time in Des Moines (US Central), refreshed every 15 seconds.
 * Not a live region: a clock that announces itself would be noise.
 */
const LocalTime = ({ className = "" }) => {
  const [time, setTime] = useState(now);

  useEffect(() => {
    const id = setInterval(() => setTime(now()), 15000);
    return () => clearInterval(id);
  }, []);

  return <span className={className}>{time}</span>;
};

export default LocalTime;
