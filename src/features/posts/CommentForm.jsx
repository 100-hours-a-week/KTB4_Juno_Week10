import { useEffect, useRef, useState } from "react";
import Icon from "../../components/common/Icon";

const CommentForm = ({ editingComment, isSubmitting, onCancelEdit, onSubmit }) => {
  const textareaRef = useRef(null);
  const [content, setContent] = useState(editingComment?.content ?? "");

  useEffect(() => {
    if (editingComment) {
      textareaRef.current?.focus();
    }
  }, [editingComment]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || isSubmitting) {
      return;
    }

    await onSubmit(trimmedContent);
    setContent("");
  };

  const handleCancelEdit = () => {
    setContent("");
    onCancelEdit();
  };

  const isDisabled = isSubmitting || !content.trim();

  return (
    <form
      className="flex min-h-[148px] w-full items-start gap-4 rounded-xl border border-[#e4beba]/35 bg-white p-4 max-sm:gap-3"
      onSubmit={handleSubmit}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7e8e9] text-[#5f5e5e] max-sm:h-9 max-sm:w-9">
        <Icon className="text-2xl">person</Icon>
      </div>
      <div className="min-w-0 flex-1">
        <textarea
          ref={textareaRef}
          className="h-[76px] w-full resize-none bg-transparent py-2 text-base leading-6 text-[#191c1d] placeholder:text-[#8f6f6d]"
          placeholder="댓글을 남겨주세요."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <div className="flex justify-end gap-2 border-t border-[#e4beba]/35 pt-3">
          {editingComment && (
            <button
              type="button"
              className="h-[38px] min-w-[92px] rounded-full bg-[#f3f4f5] px-5 text-xs font-bold text-[#5f5e5e]"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
            >
              <span style={{ fontSize: "12px", fontWeight: 800 }}>취소</span>
            </button>
          )}
          <button
            type="submit"
            className="flex h-[38px] min-w-[124px] items-center justify-center rounded-full bg-[#9c2600] px-5 text-xs font-bold text-white transition hover:bg-[#721c00] disabled:cursor-not-allowed disabled:opacity-55"
            disabled={isDisabled}
          >
            <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 800 }}>
              {editingComment ? "댓글 수정" : "댓글 등록"}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
