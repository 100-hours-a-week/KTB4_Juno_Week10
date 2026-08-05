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
      <h3 className="mb-4 text-xl font-normal leading-7 text-[#191c1d]">
        카테고리 선택
      </h3>
      <p className="mb-5 text-sm leading-5 text-[#7b7c7f]">
        카테고리는 최대 {maxSelection}개까지 선택 가능합니다.
      </p>

      {isLoading && (
        <p className="text-sm leading-5 text-[#5f5e5e]">
          카테고리를 불러오는 중입니다.
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="text-sm leading-5 text-[#ba1a1a]">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && (
        <div
          className="grid w-full max-w-[372px] gap-x-3 gap-y-3"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          {categories.map((category) => {
            const categoryId = getCategoryId(category);
            const isSelected = selectedCategoryIds.includes(categoryId);
            const isOptionDisabled =
              disabled || !categoryId || (hasReachedMaxSelection && !isSelected);

            return (
              <button
                key={categoryId}
                type="button"
                className={`min-h-12 rounded-full px-5 py-3 text-left text-base font-normal leading-6 transition active:scale-95 disabled:cursor-not-allowed ${
                  isSelected
                    ? "border border-[#ff8a8a] bg-white text-[#d72020] shadow-[0_1px_4px_rgba(255,138,138,0.2)]"
                    : "border border-transparent bg-[#f1f1f1] text-[#55585c] hover:bg-[#ebebeb] disabled:opacity-60"
                }`}
                aria-pressed={isSelected}
                disabled={isOptionDisabled}
                onClick={() => onToggle(categoryId)}
              >
                # <span className="tracking-[1px]">{category.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
