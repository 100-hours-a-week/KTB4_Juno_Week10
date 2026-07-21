import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, setAuthSession } from "@/api";
import { ROUTES } from "@/constants/routes";
import {
  getLoginErrorMessage,
  passwordRegex,
  emailRegex,
} from "@/utils/validators";
import { getSigninAccessToken, getSigninUserId } from "@/utils/normalizers";
import AuthField from "@/features/auth/AuthField";

const initialValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [helperMessage, setHelperMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      emailRegex.test(values.email.trim()) &&
      passwordRegex.test(values.password.trim())
    );
  }, [values.email, values.password]);

  const updateValue = (field, value) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setHelperMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorMessage = getLoginErrorMessage(values);

    if (errorMessage) {
      setHelperMessage(errorMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.signin({
        email: values.email.trim(),
        password: values.password.trim(),
      });

      setAuthSession({
        userId: getSigninUserId(response),
        accessToken: getSigninAccessToken(response),
      });
      navigate(ROUTES.posts);
    } catch (error) {
      setHelperMessage(`* ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-2" noValidate onSubmit={handleSubmit}>
      <AuthField
        id="email"
        label="이메일"
        icon="mail"
        type="email"
        autoComplete="email"
        placeholder="이메일을 입력하세요"
        value={values.email}
        onChange={(value) => updateValue("email", value)}
      />
      <AuthField
        id="password"
        label="비밀번호"
        icon="lock"
        type="password"
        autoComplete="current-password"
        placeholder="비밀번호를 입력하세요"
        value={values.password}
        onChange={(value) => updateValue("password", value)}
      />

      <p className="min-h-5 text-xs leading-5 text-[#ba1a1a]">
        {helperMessage}
      </p>

      <button
        type="submit"
        className={`h-12 w-full rounded-full text-sm font-bold text-white transition ${
          isFormValid && !isSubmitting
            ? "bg-[#b71422] hover:bg-[#930014] active:scale-[0.99]"
            : "cursor-default bg-[#c8c6c6]"
        }`}
        disabled={!isFormValid || isSubmitting}
      >
        <span style={{ fontWeight: 700 }}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </span>
      </button>
    </form>
  );
};

export default LoginForm;
