// Page components keyed by route path. Every entry is lazy: each page is its
// own chunk, fetched the first time the route is visited, so the initial
// bundle carries only the shell and the page that was actually requested.
//
// src/routes.js says which pages exist; this file says what renders them. A
// test keeps the two in sync (src/test/sitemap.test.js).
import { lazy } from "react";

export const pages = {
  "/": lazy(() => import("./Home")),
  "/about": lazy(() => import("./About")),
  "/resume": lazy(() => import("./Resume")),
  "/projects": lazy(() => import("./Projects")),
  "/how-i-work": lazy(() => import("./HowIWork")),
  "/contact": lazy(() => import("./Contact")),
};

export const NotFound = lazy(() => import("./NotFound"));
