import React from "react";
import Header from "../components/header";
import Footer from "../components/Footer";
import Resume from "../components/Resume";
import Blog from "../components/Blog";

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <Resume />
        <Blog />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
