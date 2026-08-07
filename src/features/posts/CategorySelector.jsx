import { getCategoryStyle } from "@/constants/categoryStyles";

const getCategoryId = (category) =>
  category?.category_id ?? category?.categoryId ?? category?.id;

const CategorySelector = ({
  categories = [],
  disabled = false,
  errorMessage = "",
  isLoading = false,
  maxSelection = 3,
  selectedCategoryIds = [],
  onToggle,
}) => {
  const hasReachedMaxSelection = selectedCategoryIds.length >= maxSelection;

  return (
    <div className="w-full">
      <h3 className="mb-1 text-xl font-semibold leading-7 text-[#191c1d]">
        소스 카테고리 선택
      </h3>
      <p className="mb-4 text-sm leading-5 text-[#7b7c7f]">
        소스 카테고리는 최대 {maxSelection}개까지 선택 가능해요
      </p>

      {isLoading && (
        <p className="text-sm leading-5 text-[#5f5e5e]">
          소스 카테고리를 불러오는 중입니다.
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="text-sm leading-5 text-[#ba1a1a]">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && (
        <div
          className="grid w-full max-w-[372px] gap-x-4 gap-y-4"
          style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        >
          {categories.map((category) => {
            const categoryId = getCategoryId(category);
            const isSelected = selectedCategoryIds.includes(categoryId);
            const isOptionDisabled =
              disabled ||
              !categoryId ||
              (hasReachedMaxSelection && !isSelected);

            return (
              <button
                key={categoryId}
                type="button"
                className={`w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-left font-semibold leading-3 transition active:scale-95 disabled:cursor-not-allowed ${
                  isSelected
                    ? "ring-2 ring-[#191c1d]/25 ring-offset-2 ring-offset-[#fff4f4]"
                    : "opacity-70 hover:opacity-100 disabled:opacity-40"
                }`}
                style={{
                  ...getCategoryStyle(category.name),
                  fontSize: "15px",
                }}
                aria-pressed={isSelected}
                disabled={isOptionDisabled}
                onClick={() => onToggle(categoryId)}
              >
                # {category.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
