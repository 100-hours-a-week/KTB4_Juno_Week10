import Icon from "../../components/common/Icon";
import { formatCount } from "../../utils/format";

const LikeButton = ({ disabled, liked, likeCount, onClick }) => {
  return (
    <button
      type="button"
      className={`flex min-w-0 items-center gap-2 bg-transparent p-0 text-[#5f5e5e] transition disabled:cursor-wait ${
        liked ? "text-[#9c2600]" : ""
      }`}
      aria-busy={disabled}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="text-[22px]" filled={liked}>
        favorite
      </Icon>
      <span className="text-sm font-semibold leading-5">
        <span>{formatCount(likeCount)}</span>
      </span>
    </button>
  );
};

export default LikeButton;
