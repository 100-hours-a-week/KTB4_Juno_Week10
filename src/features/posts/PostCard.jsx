import { Link } from "react-router-dom";
import { getFullImageUrl } from "@/api";
import { ROUTES } from "@/constants/routes";
import {
  isWithdrawnAuthorNickname,
  normalizePostListItem,
} from "@/utils/normalizers";
import PostStats from "@/features/posts/PostStats";

const PostCard = ({ post }) => {
  const normalizedPost = normalizePostListItem(post);
  const postUrl = ROUTES.postDetail.replace(":postId", normalizedPost.id);
  const authorImageStyle = normalizedPost.authorProfileImage
    ? { backgroundImage: `url(${getFullImageUrl(normalizedPost.authorProfileImage)})` }
    : undefined;
  const thumbnailStyle = normalizedPost.image
    ? { backgroundImage: `url(${getFullImageUrl(normalizedPost.image)})` }
    : undefined;
  const isWithdrawnAuthor = isWithdrawnAuthorNickname(
    normalizedPost.authorNickname,
  );

  return (
    <Link to={postUrl} className="group block text-inherit">
      <article className="flex min-h-[188px] w-full gap-4 rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_14px_rgba(0,0,0,0.04)] max-sm:flex-col">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span
              className="h-8 w-8 shrink-0 rounded-full bg-[#e7e8e9] bg-cover bg-center bg-no-repeat"
              style={authorImageStyle}
            />
            <div className="flex min-w-0 flex-col">
              <span
                className={`truncate text-sm font-semibold leading-[18px] ${
                  isWithdrawnAuthor ? "text-[#a9a9a9]" : "text-[#191c1d]"
                }`}
              >
                {normalizedPost.authorNickname}
              </span>
              <time className="text-xs leading-4 text-[#5f5e5e]">
                {normalizedPost.createdAt}
              </time>
            </div>
          </div>

          <h3 className="mt-3 truncate font-['Plus_Jakarta_Sans'] text-lg font-semibold leading-6 text-[#191c1d] transition group-hover:text-[#9c2600]">
            {normalizedPost.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-base leading-6 text-[#5f5e5e]">
            {normalizedPost.content}
          </p>

          <PostStats
            likeCount={normalizedPost.likeCount}
            commentCount={normalizedPost.commentCount}
            viewCount={normalizedPost.viewCount}
          />
        </div>

        {normalizedPost.image && (
          <div
            className="min-h-[156px] w-40 shrink-0 rounded-lg bg-[#e7e8e9] bg-cover bg-center bg-no-repeat max-sm:order-first max-sm:w-full"
            style={thumbnailStyle}
            aria-label="게시글 이미지"
          />
        )}
      </article>
    </Link>
  );
};

export default PostCard;
