import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Analytics from "./components/Analytics";
import { routes } from "./routes";
import { pages, NotFound } from "./pages";

// Routes come from the manifest; components from src/pages/index.js. Adding a
// page means one entry in each — never a change here.
function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map(({ path }) => {
            const Page = pages[path];
            return path === "/" ? (
              <Route key={path} index element={<Page />} />
            ) : (
              <Route key={path} path={path.slice(1)} element={<Page />} />
            );
          })}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
