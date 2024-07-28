"use client";
import Profile from "@components/Profile";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const MyProfile = () => {
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  //   edit function
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  //   Delete function
  const handleDelete = async (id) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompts?"
    );
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${id.toString()}`, { method: "DELETE" });
        const filteredPosts = posts.filter((p) => p._id !== id);
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };
    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);
  return (
    <Profile
      name={"My"}
      desc="Welcome to your personalized profile page"
      data={posts}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />
  );
};

export default MyProfile;
