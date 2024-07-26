"use client";
import React, { useEffect, useState } from "react";
import PromptCard from "./PromptCard";

const Feed = () => {
  const [searchText, setSearchText] = useState();
  const [posts, setPosts] = useState([]);
  const handleSearch = async (text) => {
    if (!text) return;
    const promiseRes = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    const response = await promiseRes.json();
    if (response.data) {
      setPosts(response.data);
    } else {
      alert(response.message);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && searchText) {
      handleSearch(searchText);
    }
  };
  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setPosts(data);
  };
  const handleTagClick = (tag) => {
    setSearchText(tag);
    handleSearch(tag);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const PromptCardList = ({ data, handleTagClick }) => {
    return (
      <div className="mt-16 prompt_layout">
        {data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="feed">
      <div className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            if (e.target.value === "") {
              fetchPosts();
            }
          }}
          onKeyDown={handleKeyPress}
          required
          className="search_input peer"
        />
      </div>
      <PromptCardList data={posts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
