import { useState } from "react";
import { Link } from "react-router-dom";
import { getFullImageUrl, postApi } from "@/api";
import defaultImage from "@/assets/default.png";
import Icon from "@/components/common/Icon";
import { getCategoryStyle } from "@/constants/categoryStyles";
import { ROUTES } from "@/constants/routes";
import { formatCount } from "@/utils/format";
import { markBookmarkRead, markBookmarkUnread } from "@/utils/bookmarkEvents";
import { normalizePostListItem } from "@/utils/normalizers";
import { pickField } from "@/utils/object";

const CategoryPostCard = ({ post }) => {
  const normalizedPost = normalizePostListItem(post);
  const [isBookmarked, setIsBookmarked] = useState(normalizedPost.bookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(
    normalizedPost.bookmarkCount,
  );
  const [isBookmarkProcessing, setIsBookmarkProcessing] = useState(false);
  const postPath = ROUTES.postDetail.replace(":postId", normalizedPost.id);
  const imageSrc = normalizedPost.image
    ? getFullImageUrl(normalizedPost.image)
    : defaultImage;
  const authorImageStyle = normalizedPost.authorProfileImage
    ? {
        backgroundImage: `url(${getFullImageUrl(
          normalizedPost.authorProfileImage,
        )})`,
      }
    : undefined;

  const handleBookmarkClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isBookmarkProcessing) {
      return;
    }

    setIsBookmarkProcessing(true);

    try {
      const previousBookmarked = isBookmarked;
      const previousBookmarkCount = Number(bookmarkCount ?? 0);
      const fallbackBookmarkCount = previousBookmarked
        ? Math.max(previousBookmarkCount - 1, 0)
        : previousBookmarkCount + 1;
      const response = previousBookmarked
        ? await postApi.unbookmarkPost(normalizedPost.id)
        : await postApi.bookmarkPost(normalizedPost.id);
      const nextBookmarkCount =
        pickField(response?.data, "bookmark_count", "bookmarkCount") ??
        fallbackBookmarkCount;
      const nextBookmarked =
        pickField(response?.data, "bookmarked") ?? !previousBookmarked;

      setIsBookmarked(nextBookmarked);
      setBookmarkCount(nextBookmarkCount);

      if (!previousBookmarked && nextBookmarked) {
        markBookmarkUnread();
      }

      if (previousBookmarked && !nextBookmarked) {
        markBookmarkRead();
      }
    } finally {
      setIsBookmarkProcessing(false);
    }
  };

  return (
    <Link to={postPath} className="block text-inherit">
      <article className="overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_rgba(25,28,29,0.08)]">
        <div className="relative h-[220px] w-full overflow-hidden bg-[#f1f1f1]">
          <img
            className="h-full w-full object-cover"
            src={imageSrc}
            alt={`${normalizedPost.title} 이미지`}
          />
          <button
            type="button"
            className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition active:scale-95 disabled:cursor-wait ${
              isBookmarked ? "text-[#9c2600]" : "text-[#5f5e5e]"
            }`}
            aria-label="게시글 북마크"
            disabled={isBookmarkProcessing}
            onClick={handleBookmarkClick}
          >
            <Icon className="text-[25px]" filled={isBookmarked}>
              bookmark
            </Icon>
          </button>
        </div>

        <div className="p-4">
          {normalizedPost.categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {normalizedPost.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold leading-4"
                  style={getCategoryStyle(category.name)}
                >
                  #{category.name}
                </span>
              ))}
            </div>
          )}

          <h3 className="line-clamp-2 break-keep text-xl font-bold leading-7 text-[#191c1d]">
            {normalizedPost.title}
          </h3>

          <p className="mt-3 line-clamp-2 break-keep text-base leading-6 text-[#6f5754]">
            {normalizedPost.content}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-[#eceef0] pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-5 w-5 shrink-0 rounded-full bg-[#e7e8e9] bg-cover bg-center bg-no-repeat"
                style={authorImageStyle}
              />
              <span className="truncate text-xs font-semibold leading-4 text-[#5f5e5e]">
                {normalizedPost.authorNickname}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-3 text-[#5f5e5e]">
              <span className="flex items-center gap-1 text-xs leading-4">
                <Icon className="text-[17px]">visibility</Icon>
                {formatCount(normalizedPost.viewCount)}
              </span>
              <span className="flex items-center gap-1 text-xs leading-4">
                <Icon className="text-[17px]">forum</Icon>
                {formatCount(normalizedPost.commentCount)}
              </span>
              <span className="flex items-center gap-1 text-xs leading-4">
                <Icon className="text-[17px]">bookmark</Icon>
                {formatCount(bookmarkCount)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CategoryPostCard;
