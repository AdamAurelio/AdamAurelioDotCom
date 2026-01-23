import React from "react";
import BlogList from "./BlogList";

const Blog = () => {
  return (
    <section id="blog" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Blog</h2>
      <BlogList />
    </section>
  );
};

export default Blog;
