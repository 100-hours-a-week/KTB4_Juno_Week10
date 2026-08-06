import { useEffect, useMemo, useState } from "react";
import { userApi } from "@/api";
import Icon from "@/components/common/Icon";
import PostList from "@/features/posts/PostList";
import { markBookmarkRead } from "@/utils/bookmarkEvents";
import { getPostsFromResponse } from "@/utils/normalizers";
import { pickField } from "@/utils/object";

const SORT_OPTIONS = [
  { value: "recentSaved", label: "최근 저장순" },
  { value: "latest", label: "최신순" },
  { value: "views", label: "조회순" },
  { value: "comments", label: "댓글순" },
];

const getTimestamp = (post, ...keys) => {
  const value = pickField(post, ...keys) ?? "";
  const timestamp = new Date(String(value).replace(" ", "T")).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getCreatedTimestamp = (post) => {
  return getTimestamp(post, "created_at");
};

const getBookmarkedTimestamp = (post) => {
  return getTimestamp(post, "bookmarked_at");
};

const getNumber = (post, ...keys) => {
  const value = Number(pickField(post, ...keys) ?? 0);

  return Number.isNaN(value) ? 0 : value;
};

const BookmarkedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("recentSaved");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    "최근 저장순";

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sort === "views") {
        return (
          getNumber(b, "view_count") - getNumber(a, "view_count") ||
          getCreatedTimestamp(b) - getCreatedTimestamp(a)
        );
      }

      if (sort === "comments") {
        return (
          getNumber(b, "comment_count") - getNumber(a, "comment_count") ||
          getCreatedTimestamp(b) - getCreatedTimestamp(a)
        );
      }

      if (sort === "latest") {
        return getCreatedTimestamp(b) - getCreatedTimestamp(a);
      }

      return (
        getBookmarkedTimestamp(b) - getBookmarkedTimestamp(a) ||
        getCreatedTimestamp(b) - getCreatedTimestamp(a)
      );
    });
  }, [posts, sort]);

  useEffect(() => {
    markBookmarkRead();

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

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setIsSortOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-5 pb-8 pt-10">
      <section className="mx-auto w-full max-w-[896px]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold leading-8 text-[#191c1d] max-sm:text-lg max-sm:leading-7">
            {posts.length}개의 소스가
            <br />
            북마크되어 있어요
          </h2>
          <div className="mt-2 flex w-full justify-end">
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
                  aria-label="북마크 게시글 정렬"
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
            posts={sortedPosts}
            emptyMessage="북마크한 게시글이 없습니다."
          />
        )}
      </section>
    </main>
  );
};

export default BookmarkedPostsPage;
