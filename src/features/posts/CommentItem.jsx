import { useState } from "react";
import { getFullImageUrl } from "@/api";
import Icon from "@/components/common/Icon";
import { formatCommentCreatedAt } from "@/utils/format";
import { isWithdrawnAuthorNickname } from "@/utils/normalizers";

const CommentItem = ({ comment, isOwner, onDelete, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileStyle = comment.authorProfileImage
    ? { backgroundImage: `url(${getFullImageUrl(comment.authorProfileImage)})` }
    : undefined;
  const isWithdrawnAuthor = isWithdrawnAuthorNickname(comment.authorNickname);

  return (
    <article className="flex min-h-[112px] w-full items-start justify-between gap-3 rounded-[22px] border border-[#dedede] bg-white px-6 py-5 shadow-[0_2px_5px_rgba(0,0,0,0.06)]">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e7e8e9] bg-cover bg-center bg-no-repeat text-[#6b504c]">
          {profileStyle ? (
            <span
              className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
              style={profileStyle}
            />
          ) : (
            <Icon style={{ fontSize: "26px" }}>person</Icon>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <span
            className={`block max-w-[180px] truncate text-base font-bold leading-6 ${
              isWithdrawnAuthor ? "text-[#a9a9a9]" : "text-[#191c1d]"
            }`}
          >
            {comment.authorNickname}
          </span>
          <p className="mt-2 whitespace-pre-wrap break-words text-base leading-6 text-[#6b403d]">
            {comment.content}
          </p>
          <time className="mt-3 block text-sm leading-5 text-[#8a7976]">
            {formatCommentCreatedAt(comment.createdAt)}
          </time>
        </div>
      </div>

      {isOwner && (
        <div
          className="relative -mt-2 shrink-0"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsMenuOpen(false);
            }
          }}
        >
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center bg-transparent text-[#6b504c] transition hover:text-[#9c2600]"
            aria-label="댓글 메뉴"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <Icon style={{ fontSize: "28px" }}>more_horiz</Icon>
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 top-8 z-20 w-24 overflow-hidden rounded-lg border border-[#eceef0] bg-white py-1 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
              role="menu"
            >
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-[12px] font-semibold leading-4 text-[#191c1d] hover:bg-[#f8f9fa]"
                role="menuitem"
                style={{ fontSize: "12px" }}
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit(comment);
                }}
              >
                수정하기
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-[12px] font-semibold leading-4 text-[#ba1a1a] hover:bg-[#fff1f1]"
                role="menuitem"
                style={{ fontSize: "12px" }}
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(comment);
                }}
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default CommentItem;
