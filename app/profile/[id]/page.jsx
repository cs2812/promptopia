"use client";
import Profile from "@components/Profile";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const username = searchParams.get("name");
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPostsData = async () => {
      let response = await fetch(`/api/users/${params?.id}/posts`);
      let data = await response.json();
      setUserPosts(data);
    };
    if (params?.id) fetchPostsData();
  }, [params?.id]);

  return (
    <>
      <Profile
        name={username}
        desc={`Welcome to ${username}'s personalized profile page. Explore ${username}'s exceptional prompts and be inspired by the power of their imagination`}
        data={userPosts}
      />
    </>
  );
};

export default UserProfile;
