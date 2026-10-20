import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Icon from "./Icon";
import { icons } from "./icons";
import * as home from "../../content/home";
import * as about from "../../content/about";
import * as projects from "../../content/projects";
import * as howIWork from "../../content/howIWork";
import * as resume from "../../content/resume";

// Every `icon` value anywhere in the content modules, however deeply nested.
const iconNamesIn = (value) => {
  if (Array.isArray(value)) return value.flatMap(iconNamesIn);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, v]) =>
      key === "icon" && typeof v === "string" ? [v] : iconNamesIn(v)
    );
  }
  return [];
};

describe("Icon", () => {
  it("renders a decorative svg hidden from assistive tech", () => {
    const { container } = render(<Icon name="mail" className="h-4 w-4" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveClass("h-4", "w-4");
    expect(svg.children.length).toBe(icons.mail.length);
  });

  it("renders nothing for an unknown name", () => {
    const { container } = render(<Icon name="not-an-icon" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("knows every icon the site content names", () => {
    const used = iconNamesIn([home, about, projects, howIWork, resume]);
    expect(used.length).toBeGreaterThan(0);
    expect(used.filter((name) => !icons[name])).toEqual([]);
  });
});
