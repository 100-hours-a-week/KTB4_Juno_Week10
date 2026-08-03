import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/common/Icon";
import { postApi } from "@/api";
import { ROUTES } from "@/constants/routes";
import PostList from "@/features/posts/PostList";

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "bookmarks", label: "북마크순" },
  { value: "views", label: "조회순" },
  { value: "comments", label: "댓글순" },
];

const POST_PAGE_SIZE = 10;

const INITIAL_PAGE_INFO = {
  page: 0,
  size: POST_PAGE_SIZE,
  totalPages: 0,
  totalElements: 0,
  first: true,
  last: true,
  hasNext: false,
  hasPrevious: false,
};

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState(INITIAL_PAGE_INFO);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "최신순";

  useEffect(() => {
    let ignore = false;

    const loadPosts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await postApi.getPosts({
          sort,
          page,
          size: POST_PAGE_SIZE,
        });

        if (!ignore) {
          const responseData = response.data;

          setPosts(responseData.posts);
          setPageInfo({
            page: responseData.page,
            size: responseData.size,
            totalPages: responseData.total_pages,
            totalElements: responseData.total_elements,
            first: responseData.first,
            last: responseData.last,
            hasNext: responseData.has_next,
            hasPrevious: responseData.has_previous,
          });
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
  }, [page, sort]);

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(0);
    setIsSortOpen(false);
  };

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((currentPage) => currentPage + 1);
  };

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

          <div className="mb-2 flex w-full gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

          <div className="mb-4 flex w-full justify-end">
            <div className="relative shrink-0">
              <button
                type="button"
                className="flex min-h-6 items-center gap-1 rounded-full border border-[#eceef0] bg-white px-2 py-1 text-[#191c1d] transition hover:border-[#dadde0] active:scale-95"
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                onClick={() => setIsSortOpen((current) => !current)}
              >
                <Icon className="text-sm text-[#191c1d] [color:#191c1d]">
                  sort
                </Icon>
                <span className="text-[10px] font-normal leading-4 tracking-normal">
                  {selectedSortLabel}
                </span>
              </button>

              {isSortOpen && (
                <div
                  className="absolute right-0 top-10 z-20 w-20 overflow-hidden rounded-lg border border-[#eceef0] bg-white py-0.5"
                  role="listbox"
                  aria-label="게시글 정렬"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`block w-full px-2 py-1 text-left text-[8px] leading-3 ${
                        option.value === sort
                          ? "bg-[#fff1ed] text-[#9c2600]"
                          : "text-[#191c1d] hover:bg-[#f8f9fa]"
                      }`}
                      style={{ fontSize: "8px" }}
                      role="option"
                      aria-selected={option.value === sort}
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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

          {!isLoading && !errorMessage && (
            <>
              <PostList posts={posts} />

              {pageInfo.totalPages > 0 && (
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dadde0] bg-white text-[#191c1d] transition hover:border-[#b71422] hover:text-[#b71422] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="이전 페이지"
                    disabled={pageInfo.first || !pageInfo.hasPrevious}
                    onClick={handlePreviousPage}
                  >
                    <Icon className="text-xl">chevron_left</Icon>
                  </button>

                  <span className="min-w-16 text-center text-sm font-semibold leading-5 text-[#5f5e5e]">
                    {pageInfo.page + 1} / {pageInfo.totalPages}
                  </span>

                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dadde0] bg-white text-[#191c1d] transition hover:border-[#b71422] hover:text-[#b71422] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="다음 페이지"
                    disabled={pageInfo.last || !pageInfo.hasNext}
                    onClick={handleNextPage}
                  >
                    <Icon className="text-xl">chevron_right</Icon>
                  </button>
                </div>
              )}
            </>
          )}
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
