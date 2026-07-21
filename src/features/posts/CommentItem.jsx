import { getFullImageUrl } from "@/api";
import Icon from "@/components/common/Icon";
import { isWithdrawnAuthorNickname } from "@/utils/normalizers";

const CommentItem = ({ comment, isOwner, onDelete, onEdit }) => {
  const profileStyle = comment.authorProfileImage
    ? { backgroundImage: `url(${getFullImageUrl(comment.authorProfileImage)})` }
    : undefined;
  const isWithdrawnAuthor = isWithdrawnAuthorNickname(comment.authorNickname);

  return (
    <article className="flex min-h-28 w-full items-start justify-between gap-4 rounded-xl border border-[#e4beba]/25 bg-white p-4 max-sm:flex-col">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          className="h-9 w-9 shrink-0 rounded-full bg-[#e7e8e9] bg-cover bg-center bg-no-repeat"
          style={profileStyle}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span
              className={`max-w-[180px] truncate text-sm font-bold leading-5 ${
                isWithdrawnAuthor ? "text-[#a9a9a9]" : "text-[#191c1d]"
              }`}
            >
              {comment.authorNickname}
            </span>
            <time className="shrink-0 text-xs leading-4 text-[#5f5e5e]">
              {comment.createdAt}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-wrap break-words text-base leading-6 text-[#5b403e]">
            {comment.content}
          </p>
        </div>
      </div>

      {isOwner && (
        <div className="flex shrink-0 items-center gap-2 max-sm:self-end">
          <button
            type="button"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#5f5e5e] transition hover:bg-[#e7e8e9] hover:text-[#9c2600]"
            aria-label="댓글 수정"
            onClick={() => onEdit(comment)}
          >
            <Icon className="text-xl">edit</Icon>
          </button>
          <button
            type="button"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#ba1a1a] transition hover:bg-[#ffdad6] hover:text-[#93000a]"
            aria-label="댓글 삭제"
            onClick={() => onDelete(comment)}
          >
            <Icon className="text-xl">delete</Icon>
          </button>
        </div>
      )}
    </article>
  );
};

export default CommentItem;
