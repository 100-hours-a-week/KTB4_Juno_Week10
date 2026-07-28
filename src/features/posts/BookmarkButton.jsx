import Icon from "@/components/common/Icon";
import { formatCount } from "@/utils/format";

const BookmarkButton = ({ bookmarked, bookmarkCount, disabled, onClick }) => {
  return (
    <button
      type="button"
      className={`flex min-w-0 items-center gap-2 bg-transparent p-0 text-[#5f5e5e] transition disabled:cursor-wait ${
        bookmarked ? "text-[#9c2600]" : ""
      }`}
      aria-busy={disabled}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon
        className="flex h-6 w-6 items-center justify-center text-[24px] leading-none"
        filled={bookmarked}
      >
        bookmark
      </Icon>
      <span className="text-sm font-semibold leading-5">
        <span>{formatCount(bookmarkCount)}</span>
      </span>
    </button>
  );
};

export default BookmarkButton;
