import React from "react";
import BlogPost from "./BlogPost";

const BlogList = () => {
  const posts = [
    {
      id: 1,
      title: "Theology Post 1",
      content: "Content of theology post 1...",
    },
    {
      id: 2,
      title: "Technology Post 1",
      content: "Content of technology post 1...",
    },
    { id: 3, title: "Family Post 1", content: "Content of family post 1..." },
  ];

  return (
    <div>
      {posts.map((post) => (
        <BlogPost key={post.id} title={post.title} content={post.content} />
      ))}
    </div>
  );
};

export default BlogList;
