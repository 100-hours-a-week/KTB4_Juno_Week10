import { getFullImageUrl } from "@/api";

const CategoryCard = ({ category, description }) => {
  return (
    <button
      type="button"
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
        <h3 className="break-keep text-lg font-bold leading-6 text-[#191c1d]">
          {category.name}
        </h3>
      </div>

      <p className="mt-1 min-h-9 break-keep text-sm leading-5 text-[#7d858e]">
        {description}
      </p>
    </button>
  );
};

export default CategoryCard;
