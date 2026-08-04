import Icon from "@/components/common/Icon";

const SearchInput = ({
  id,
  value,
  placeholder = "검색",
  resetLabel = "검색 초기화",
  disabled = false,
  showReset = Boolean(value),
  onChange,
  onSubmit,
  onReset,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  const showResetButton = showReset && onReset;

  return (
    <form className="w-full" role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={id}>
        {placeholder}
      </label>
      <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#eceef0] bg-white px-3 transition focus-within:border-[#9c2600]">
        <Icon className="text-xl text-[#5f5e5e] [color:#5f5e5e]">
          search
        </Icon>
        <input
          id={id}
          type="search"
          className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-[#191c1d] outline-none placeholder:text-[#8b8b8b] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
        />
        {showResetButton && (
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#5f5e5e] transition hover:bg-[#f1f3f4] hover:text-[#191c1d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={resetLabel}
            disabled={disabled}
            onClick={onReset}
          >
            <Icon className="text-lg">close</Icon>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
