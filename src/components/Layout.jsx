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
    <div className="min-h-screen flex flex-col bg-navy-50 dark:bg-navy-950 transition-colors">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      {/* tabIndex=-1 makes <main> programmatically focusable (for the route
          change above) without adding it to the tab order. */}
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="flex-grow outline-none"
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
