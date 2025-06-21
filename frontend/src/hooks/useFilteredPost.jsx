import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useFilteredPosts = (searchQuery) => {
  const { posts } = useSelector((store) => store.post);
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPosts(posts);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const matched = posts.filter((post) =>
        post.title.toLowerCase().includes(lowerQuery)
      );
      const others = posts.filter(
        (post) => !post.title.toLowerCase().includes(lowerQuery)
      );

      setFilteredPosts([...matched, ...others]);
    }
  }, [searchQuery, posts]);

  return filteredPosts;
};

export default useFilteredPosts;
