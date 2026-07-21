import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/common/Icon";
import { postApi } from "@/api";
import { ROUTES } from "@/constants/routes";
import PostList from "@/features/posts/PostList";
import { getPostsFromResponse } from "@/utils/normalizers";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadPosts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await postApi.getPosts();

        if (!ignore) {
          setPosts(getPostsFromResponse(response));
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[#f8f9fa] px-5 pb-8 pt-24">
        <section className="mx-auto w-full max-w-[896px]">
          <div className="mb-6">
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold leading-[38px] text-[#191c1d] max-sm:text-2xl max-sm:leading-8">
              Community Board
            </h2>
            <p className="mt-1 text-base leading-6 text-[#5f5e5e]">
              다른 사용자들과 자유롭게 이야기를 나눠보세요.
            </p>
          </div>

          <div className="mb-6 flex w-full gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              className="shrink-0 rounded-full bg-[#9c2600] px-4 py-1 text-[12px] font-bold leading-4 text-white"
              disabled
            >
              <span style={{ fontSize: "12px", fontWeight: 800 }}>
                전체 게시글
              </span>
            </button>
          </div>

          {isLoading && (
            <div className="rounded-xl bg-white p-6 text-center text-base text-[#5f5e5e] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_14px_rgba(0,0,0,0.04)]">
              게시글을 불러오는 중입니다.
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="rounded-xl border border-[#e4beba] bg-white p-6 text-center">
              <p className="text-base font-semibold text-[#ba1a1a]">
                게시글을 불러오지 못했습니다.
              </p>
              <p className="mt-2 text-sm text-[#5f5e5e]">{errorMessage}</p>
            </div>
          )}

          {!isLoading && !errorMessage && <PostList posts={posts} />}
        </section>
      </main>

      <Link
        to={ROUTES.postCreate}
        className="fixed bottom-24 right-[max(1.25rem,calc((100vw-430px)/2+1.25rem))] z-[150] flex h-14 w-14 items-center justify-center rounded-full bg-[#9c2600] text-white shadow-[0_8px_20px_rgba(183,20,34,0.28)] transition hover:scale-105 hover:bg-[#721c00] active:scale-90"
        aria-label="게시글 작성"
      >
        <Icon className="text-3xl text-white [color:#FFFFFF]">add</Icon>
      </Link>
    </>
  );
};

export default PostListPage;
