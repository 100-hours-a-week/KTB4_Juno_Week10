import { useEffect, useRef, useState } from "react";
import Icon from "@/components/common/Icon";

const CommentForm = ({
  editingComment,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}) => {
  const inputRef = useRef(null);
  const [content, setContent] = useState(editingComment?.content ?? "");

  useEffect(() => {
    if (editingComment) {
      inputRef.current?.focus();
    }
  }, [editingComment]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || isSubmitting) {
      return;
    }

    try {
      await onSubmit(trimmedContent);
      setContent("");
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleCancelEdit = () => {
    setContent("");
    onCancelEdit();
  };

  const isDisabled = isSubmitting || !content.trim();

  return (
    <form
      className="fixed bottom-[72px] left-1/2 z-[140] flex w-full max-w-[430px] -translate-x-1/2 items-center gap-3 border-t border-[#e4e4e4] bg-[#fff4f4] px-6 py-3"
      onSubmit={handleSubmit}
    >
      <div className="relative min-w-0 flex-1">
        <input
          ref={inputRef}
          className="h-[54px] w-full rounded-full border border-[#dedede] bg-white px-6 pr-12 text-base leading-6 text-[#191c1d] outline-none placeholder:text-[#9b8b89] focus:border-[#c92525]"
          placeholder="댓글을 남겨주세요..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <Icon
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#6b504c]"
          style={{ fontSize: "28px" }}
        >
          sentiment_satisfied
        </Icon>
      </div>
      {editingComment && (
        <button
          type="button"
          className="h-[38px] shrink-0 rounded-full bg-white px-3 text-xs font-bold text-[#5f5e5e]"
          onClick={handleCancelEdit}
          disabled={isSubmitting}
        >
          취소
        </button>
      )}
      <button
        type="submit"
        className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#c92525] text-white transition hover:bg-[#b71f1f] disabled:cursor-not-allowed disabled:opacity-55"
        aria-label={editingComment ? "댓글 수정" : "댓글 등록"}
        disabled={isDisabled}
      >
        <Icon filled style={{ fontSize: "26px" }}>
          send
        </Icon>
      </button>
    </form>
  );
};

export default CommentForm;
