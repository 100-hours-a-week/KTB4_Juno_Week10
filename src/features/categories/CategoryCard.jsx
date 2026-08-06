import { Link } from "react-router-dom";
import { getFullImageUrl } from "@/api";
import { getCategoryStyle } from "@/constants/categoryStyles";

const CategoryCard = ({ category, description, state, to }) => {
  return (
    <Link
      to={to}
      state={state}
      className="min-w-0 rounded-[28px] bg-white p-4 text-left shadow-[0_2px_6px_rgba(44,23,23,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(44,23,23,0.1)] active:scale-[0.98]"
    >
      {category.image && (
        <img
          className="aspect-[1.34/1] w-full rounded-[16px] object-cover"
          src={getFullImageUrl(category.image)}
          alt={`${category.name} 대표 이미지`}
        />
      )}

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3
          className="break-keep rounded-full px-3 py-1 text-[11px] font-semibold leading-4"
          style={getCategoryStyle(category.name)}
        >
          # {category.name}
        </h3>
        <span className="mt-0.5 inline-flex min-h-5 min-w-z shrink-0 items-center justify-center rounded-full bg-[#fff1f1] px-2 text-xs font-bold leading-4 text-[#ff2d2d]">
          {category.post_count}개
        </span>
      </div>

      <p className="mt-1 min-h-9 break-keep text-sm leading-5 text-[#7d858e]">
        {description}
      </p>
    </Link>
  );
};

export default CategoryCard;
