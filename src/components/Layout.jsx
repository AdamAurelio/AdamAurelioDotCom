import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Site chrome around every page, plus two things a single-page app has to do
 * for itself because the browser only does them on a full page load:
 *
 *  1. Reset scroll to the top on navigation. BrowserRouter does not, so a
 *     visitor who clicks "About" from the bottom of Home would otherwise land
 *     mid-page.
 *  2. Move keyboard/screen-reader focus to the new page's content. Without
 *     this, focus stays on the header link that was clicked and assistive
 *     tech never hears that the page changed.
 *
 * Neither runs on the initial load — the browser handles that one, and
 * stealing focus from the address bar on arrival is hostile.
 */
const Layout = () => {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip">
      {/* Decoration behind every page: soft washes of dawn light under the
          glass header, and the real contour lines of Des Moines (downtown,
          where the Des Moines and Raccoon rivers meet, sits behind Home's
          "What I do"). Both are inert and hidden from assistive tech. */}
      <div className="wash h-[60rem]" aria-hidden="true">
        <i className="left-[-18%] top-[-30%] h-[46rem] w-[62rem] bg-[radial-gradient(closest-side,var(--w-teal),transparent)]" />
        <i className="right-[-14%] top-[-6%] h-[52rem] w-[58rem] bg-[radial-gradient(closest-side,var(--w-gold),transparent)]" />
        <i className="left-[22%] top-[38%] h-[30rem] w-[56rem] bg-[radial-gradient(closest-side,var(--w-blue),transparent)]" />
      </div>
      <div className="topo" aria-hidden="true">
        <img src="/dsm-topo.svg" alt="" decoding="async" />
      </div>

      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      {/* tabIndex=-1 makes <main> programmatically focusable (for the route
          change above) without adding it to the tab order. The bottom padding
          is the strip the footer's horizon overlaps. */}
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="relative z-[1] flex-grow pb-16 outline-none"
        data-app-ready="true"
      >
        <Suspense
          // Reserve height so the footer doesn't flash up while a route chunk
          // loads. Chunks are tiny and cached after first visit, so this is
          // rarely visible for more than a frame.
          fallback={<div className="min-h-[60vh]" aria-busy="true" />}
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
