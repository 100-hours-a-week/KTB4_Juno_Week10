import { useEffect, useState } from "react";
import { userApi } from "@/api";
import PostList from "@/features/posts/PostList";
import { getPostsFromResponse } from "@/utils/normalizers";

const BookmarkedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadBookmarks = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await userApi.getMyBookmarks();

        if (!ignore) {
          setPosts(getPostsFromResponse(response));
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
          setPosts([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadBookmarks();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-5 pb-8 pt-24">
      <section className="mx-auto w-full max-w-[896px]">
        <div className="mb-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold leading-[38px] text-[#191c1d] max-sm:text-2xl max-sm:leading-8">
            북마크
          </h2>
          <p className="mt-1 text-base leading-6 text-[#5f5e5e]">
            저장해 둔 게시글을 모아볼 수 있습니다.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-xl bg-white p-6 text-center text-base text-[#5f5e5e] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_14px_rgba(0,0,0,0.04)]">
            북마크한 게시글을 불러오는 중입니다.
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-xl border border-[#e4beba] bg-white p-6 text-center">
            <p className="text-base font-semibold text-[#ba1a1a]">
              북마크한 게시글을 불러오지 못했습니다.
            </p>
            <p className="mt-2 text-sm text-[#5f5e5e]">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && (
          <PostList
            posts={posts}
            emptyMessage="북마크한 게시글이 없습니다."
          />
        )}
      </section>
    </main>
  );
};

export default BookmarkedPostsPage;
