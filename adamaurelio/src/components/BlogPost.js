import React from "react";

const BlogPost = ({ title, content }) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </article>
  );
};

export default BlogPost;
