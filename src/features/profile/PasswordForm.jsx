import { useMemo, useState } from "react";
import { userApi } from "../../api";
import Icon from "../../components/common/Icon";
import {
  getProfilePasswordErrors,
  getProfilePasswordLiveErrors,
  hasValidationError,
  passwordRegex,
} from "../../utils/validators";

const PasswordInput = ({
  errorMessage,
  id,
  label,
  onChange,
  onToggle,
  showPassword,
  value,
}) => {
  return (
    <div className="mt-5 first:mt-0">
      <label
        className="mb-2 ml-1 block text-sm font-semibold leading-5 text-[#5f5e5e]"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className="h-[52px] w-full rounded-xl border-[1.5px] border-[#e4beba] bg-[#f8f9fa] px-4 pr-14 text-base leading-6 text-[#191c1d] placeholder:text-[#8b8585] transition focus:border-[#b71422] focus:shadow-[0_0_0_1px_#b71422]"
          type={showPassword ? "text" : "password"}
          placeholder={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#5f5e5e] transition hover:bg-[#b71422]/10 hover:text-[#b71422]"
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"}
          onClick={onToggle}
        >
          <Icon className="text-[22px]">
            {showPassword ? "visibility_off" : "visibility"}
          </Icon>
        </button>
      </div>
      <p className="mx-1 mt-1 min-h-[18px] text-xs leading-[18px] text-[#ba1a1a]">
        {errorMessage}
      </p>
    </div>
  );
};

const PasswordForm = ({ onToast }) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState({ password: "", passwordConfirm: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return Boolean(
      passwordRegex.test(password.trim()) &&
      passwordConfirm.trim() &&
      password.trim() === passwordConfirm.trim(),
    );
  }, [password, passwordConfirm]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = getProfilePasswordErrors({ password, passwordConfirm });
    setErrors(nextErrors);

    if (hasValidationError(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await userApi.updatePassword(password.trim());
      setPassword("");
      setPasswordConfirm("");
      setErrors({ password: "", passwordConfirm: "" });
      onToast("비밀번호가 변경되었습니다.");
    } catch (error) {
      setErrors((current) => ({ ...current, password: `*${error.message}` }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePassword = (value) => {
    setPassword(value);
    setErrors(
      getProfilePasswordLiveErrors({
        password: value,
        passwordConfirm,
      }),
    );
  };

  const updatePasswordConfirm = (value) => {
    setPasswordConfirm(value);
    setErrors(
      getProfilePasswordLiveErrors({
        password,
        passwordConfirm: value,
      }),
    );
  };

  return (
    <form
      id="securitySection"
      className="mt-2 w-full rounded-xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2 text-[#b71422]">
        <Icon className="text-[21px]">lock</Icon>
        <h3 className="text-sm font-semibold leading-5 tracking-[0.05em]">
          비밀번호 변경
        </h3>
      </div>
      <p className="mb-5 mt-2 text-xs leading-4 text-[#5f5e5e]">
        새 비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.
      </p>

      <PasswordInput
        id="profilePassword"
        label="새 비밀번호"
        value={password}
        errorMessage={errors.password}
        showPassword={showPassword}
        onToggle={() => setShowPassword((current) => !current)}
        onChange={updatePassword}
      />
      <PasswordInput
        id="profilePasswordConfirm"
        label="새 비밀번호 확인"
        value={passwordConfirm}
        errorMessage={errors.passwordConfirm}
        showPassword={showPasswordConfirm}
        onToggle={() => setShowPasswordConfirm((current) => !current)}
        onChange={updatePasswordConfirm}
      />

      <button
        type="submit"
        className={`mt-6 flex h-10 w-fit min-w-[108px] items-center justify-center gap-1.5 rounded-full px-5 text-xs font-bold leading-4 text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 ${
          isFormValid ? "bg-[#b71422] hover:bg-[#930014]" : "bg-[#c8c6c6]"
        }`}
        disabled={isSubmitting}
      >
        <Icon className="text-[18px]">lock_reset</Icon>
        <span style={{ fontSize: "12px", fontWeight: 800 }}>
          {isSubmitting ? "변경 중..." : "비밀번호 변경하기"}
        </span>
      </button>
    </form>
  );
};

export default PasswordForm;
