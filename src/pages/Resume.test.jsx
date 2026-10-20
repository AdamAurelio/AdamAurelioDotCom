import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Resume from "./Resume";
import {
  summary,
  highlights,
  skills,
  experience,
  education,
  certifications,
  community,
} from "../content/resume";

// The redesign adds visuals around the résumé's vetted wording; it must not
// drop or reword any of it.
describe("Resume", () => {
  it("renders every line of the résumé content", () => {
    render(<Resume />);
    const lines = [
      summary,
      ...skills.flatMap((s) => [s.title, ...s.items]),
      ...experience.flatMap((e) => [
        e.company,
        e.location,
        e.dates,
        ...e.roles.flatMap((r) => [
          r.title,
          ...r.groups.flatMap((g) => [g.title, ...g.bullets].filter(Boolean)),
        ]),
      ]),
      ...education.flatMap((ed) => [ed.school, ed.location, ed.degree]),
      ...certifications,
      ...community.map((c) => c.text),
    ].filter(Boolean);
    for (const line of lines) {
      expect(screen.getAllByText(line, { exact: true }).length).toBeGreaterThan(0);
    }
  });

  it("shows the at-a-glance numbers as a labelled list", () => {
    render(<Resume />);
    const glance = screen.getByRole("list", { name: "At a glance" });
    for (const { value, label } of highlights) {
      expect(glance).toHaveTextContent(`${value}${label}`);
    }
  });

  it("has exactly one h1, the name", () => {
    render(<Resume />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
