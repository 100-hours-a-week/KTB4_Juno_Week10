import Icon from "../../components/common/Icon";

const AuthField = ({
  autoComplete,
  errorMessage = "",
  icon,
  id,
  label,
  onBlur,
  onChange,
  onToggleVisibility,
  placeholder,
  required = false,
  showPassword = false,
  type = "text",
  value,
}) => {
  const isPasswordField = type === "password" && onToggleVisibility;
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5b403e]" htmlFor={id}>
        {label}
        {required && <span className="text-[#ba1a1a]">*</span>}
      </label>
      <div
        className={`flex h-14 items-center gap-3 rounded-xl border bg-[#f8f9fa] px-4 transition focus-within:border-[#b71422] focus-within:bg-white focus-within:shadow-[0_0_0_1px_#b71422] ${
          errorMessage ? "border-[#ba1a1a]" : "border-[#e4beba]"
        }`}
      >
        <Icon className="text-xl text-[#5f5e5e]">{icon}</Icon>
        <input
          id={id}
          autoComplete={autoComplete}
          className="min-w-0 flex-1 bg-transparent text-base text-[#191c1d] placeholder:text-[#8f8f8f]"
          placeholder={placeholder}
          type={inputType}
          value={value}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
        />
        {isPasswordField && (
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#5f5e5e] transition hover:bg-[#b71422]/10 hover:text-[#b71422]"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"}
            onClick={onToggleVisibility}
          >
            <Icon className="text-[22px]">
              {showPassword ? "visibility_off" : "visibility"}
            </Icon>
          </button>
        )}
      </div>
      <p
        className={`mt-1 min-h-5 text-xs leading-5 text-[#ba1a1a] ${
          errorMessage ? "visible" : "invisible"
        }`}
      >
        {errorMessage || "."}
      </p>
    </div>
  );
};

export default AuthField;
