import PostCard from "@/features/posts/PostCard";

const PostList = ({ posts }) => {
  if (!posts.length) {
    return (
      <p className="mt-20 w-full text-center text-lg leading-7 text-[#5f5e5e]">
        아직 작성된 게시글이 없습니다.
      </p>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-3">
      {posts.map((post, index) => (
        <PostCard
          key={post.postId ?? post.post_id ?? post.id ?? `post-${index}`}
          post={post}
        />
      ))}
    </div>
  );
};

export default PostList;
