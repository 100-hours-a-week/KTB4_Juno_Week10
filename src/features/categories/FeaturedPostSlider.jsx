import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getFullImageUrl, postApi } from "@/api";
import defaultImage from "@/assets/default.png";
import Icon from "@/components/common/Icon";
import { ROUTES } from "@/constants/routes";
import {
  getPostsFromResponse,
  normalizePostListItem,
} from "@/utils/normalizers";

const FEATURED_POST_RULES = [
  {
    key: "bookmarks",
    sort: "bookmarks",
    badge: "너도? 나도! 저장",
  },
  {
    key: "comments",
    sort: "comments",
    badge: "댓글이 가장 많은",
    icon: "forum",
  },
  {
    key: "views",
    sort: "views",
    badge: "조회수 폭발",
    icon: "visibility",
  },
];

const getUniqueFeaturedPosts = (responses) => {
  const usedPostIds = new Set();

  return responses
    .map((response, index) => {
      const posts = getPostsFromResponse(response).map(normalizePostListItem);
      const post = posts.find((item) => item.id && !usedPostIds.has(item.id));

      if (!post) {
        return null;
      }

      usedPostIds.add(post.id);

      return {
        ...post,
        badge: FEATURED_POST_RULES[index].badge,
        badgeIcon: FEATURED_POST_RULES[index].icon,
      };
    })
    .filter(Boolean);
};

const FeaturedPostSlider = () => {
  const slideContainerRef = useRef(null);
  const dragStateRef = useRef({
    hasDragged: false,
    isDragging: false,
    scrollLeft: 0,
    startX: 0,
  });
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadFeaturedPosts = async () => {
      setIsLoading(true);

      try {
        const responses = await Promise.all(
          FEATURED_POST_RULES.map((rule) =>
            postApi.getPosts({ sort: rule.sort, page: 0, size: 3 }),
          ),
        );

        if (!ignore) {
          setFeaturedPosts(getUniqueFeaturedPosts(responses));
        }
      } catch {
        if (!ignore) {
          setFeaturedPosts([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadFeaturedPosts();

    return () => {
      ignore = true;
    };
  }, []);

  const handleScroll = () => {
    const container = slideContainerRef.current;

    if (!container) {
      return;
    }

    const nextIndex = Math.round(container.scrollLeft / container.clientWidth);
    setActiveIndex(nextIndex);
  };

  const handleDotClick = (index) => {
    const container = slideContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      left: container.clientWidth * index,
      behavior: "smooth",
    });
  };

  const snapToNearestSlide = () => {
    const container = slideContainerRef.current;

    if (!container) {
      return;
    }

    const nextIndex = Math.round(container.scrollLeft / container.clientWidth);

    container.scrollTo({
      left: container.clientWidth * nextIndex,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (event) => {
    const container = slideContainerRef.current;

    if (!container) {
      return;
    }

    dragStateRef.current = {
      hasDragged: false,
      isDragging: true,
      scrollLeft: container.scrollLeft,
      startX: event.pageX - container.offsetLeft,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    const container = slideContainerRef.current;
    const dragState = dragStateRef.current;

    if (!container || !dragState.isDragging) {
      return;
    }

    event.preventDefault();

    const currentX = event.pageX - container.offsetLeft;
    const distance = currentX - dragState.startX;

    if (Math.abs(distance) > 4) {
      dragState.hasDragged = true;
    }

    container.scrollLeft = dragState.scrollLeft - distance;
  };

  const handleMouseDragEnd = () => {
    if (!dragStateRef.current.isDragging) {
      return;
    }

    dragStateRef.current.isDragging = false;
    setIsDragging(false);
    snapToNearestSlide();
  };

  const handleClickCapture = (event) => {
    if (!dragStateRef.current.hasDragged) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.hasDragged = false;
  };

  if (isLoading || !featuredPosts.length) {
    return null;
  }

  return (
    <section className="mb-8">
      <div
        ref={slideContainerRef}
        className={`flex select-none snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onClickCapture={handleClickCapture}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseDragEnd}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseDragEnd}
        onScroll={handleScroll}
      >
        {featuredPosts.map((post) => {
          const postPath = ROUTES.postDetail.replace(":postId", post.id);
          const hasPostImage = Boolean(post.image);

          return (
            <div key={post.id} className="w-full shrink-0 snap-center pr-1">
              <article className="flex min-h-[178px] gap-4 rounded-[28px] border border-[#ffd7d7] bg-white p-5">
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-[#fff1f1] px-3 py-1 text-xs font-bold leading-4 text-[#e82929]">
                    {post.badge}
                    {post.badgeIcon && (
                      <Icon className="text-[13px] leading-none">
                        {post.badgeIcon}
                      </Icon>
                    )}
                  </span>

                  <h3 className="line-clamp-2 break-keep text-lg font-bold leading-6 text-[#191c1d]">
                    {post.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 break-keep text-sm leading-5 text-[#69717b]">
                    {post.content}
                  </p>

                  <Link
                    to={postPath}
                    className="mt-auto inline-flex h-8 w-fit items-center justify-center rounded-full bg-[#df1f1f] px-5 text-sm font-bold leading-5 text-white [color:#ffffff]  transition hover:bg-[#c71919] active:scale-95"
                    style={{ color: "#ffffff" }}
                  >
                    <span className="text-white [color:#ffffff]">
                      보러 가기
                    </span>
                  </Link>
                </div>

                <div
                  className={`shrink-0 overflow-hidden rounded-[18px] ${
                    hasPostImage
                      ? "h-[140px] w-[104px] bg-[#f1f1f1]"
                      : "mt-4 h-[104px] w-[104px] border border-[#e0e0e0] bg-white"
                  }`}
                >
                  <img
                    className="h-full w-full object-cover"
                    src={
                      hasPostImage ? getFullImageUrl(post.image) : defaultImage
                    }
                    alt={`${post.title} 이미지`}
                  />
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {featuredPosts.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {featuredPosts.map((post, index) => (
            <button
              key={post.id}
              type="button"
              className={`h-2 rounded-full transition ${
                activeIndex === index ? "w-5 bg-[#df1f1f]" : "w-2 bg-[#ffd2d2]"
              }`}
              aria-label={`${index + 1}번째 추천 게시글 보기`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedPostSlider;
