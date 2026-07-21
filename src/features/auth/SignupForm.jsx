import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  authApi,
  clearAuthSession,
  imageApi,
  setAuthSession,
  userApi,
} from "@/api";
import { ROUTES } from "@/constants/routes";
import {
  getImageUrlFromResponse,
  getSigninAccessToken,
  getSigninUserId,
} from "@/utils/normalizers";
import {
  getSignupEmailErrorMessage,
  getSignupErrors,
  getSignupNicknameErrorMessage,
  getSignupPasswordConfirmErrorMessage,
  getSignupPasswordErrorMessage,
  hasValidationError,
  passwordRegex,
  signupEmailRegex,
  isValidNickname,
} from "@/utils/validators";
import AuthField from "@/features/auth/AuthField";
import ProfileImagePicker from "@/features/auth/ProfileImagePicker";

const initialValues = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const initialErrors = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const isLoginRequiredMessage = (message) => {
  return message.includes("로그인") || message.includes("인증");
};

const SignupForm = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      signupEmailRegex.test(values.email.trim()) &&
      passwordRegex.test(values.password.trim()) &&
      values.passwordConfirm.trim() &&
      values.password.trim() === values.passwordConfirm.trim() &&
      isValidNickname(values.nickname.trim())
    );
  }, [values]);

  const getNextErrors = (field, nextValues) => {
    if (field === "password") {
      return {
        password: getSignupPasswordErrorMessage(nextValues.password),
        passwordConfirm: nextValues.passwordConfirm
          ? getSignupPasswordConfirmErrorMessage(nextValues)
          : "",
      };
    }

    if (field === "passwordConfirm") {
      return {
        passwordConfirm: getSignupPasswordConfirmErrorMessage(nextValues),
      };
    }

    return {
      [field]: "",
    };
  };

  const updateValue = (field, value) => {
    const nextValue = field === "nickname" ? value.slice(0, 10) : value;

    setValues((current) => {
      const nextValues = {
        ...current,
        [field]: nextValue,
      };

      setErrors((currentErrors) => ({
        ...currentErrors,
        ...getNextErrors(field, nextValues),
      }));

      return nextValues;
    });
  };

  const validateField = (field) => {
    setErrors((current) => {
      if (field === "email") {
        return {
          ...current,
          email: getSignupEmailErrorMessage(values.email),
        };
      }

      if (field === "nickname") {
        return {
          ...current,
          nickname: getSignupNicknameErrorMessage(values.nickname),
        };
      }

      if (field === "password") {
        return {
          ...current,
          password: getSignupPasswordErrorMessage(values.password),
          passwordConfirm: values.passwordConfirm
            ? getSignupPasswordConfirmErrorMessage(values)
            : current.passwordConfirm,
        };
      }

      return {
        ...current,
        passwordConfirm: getSignupPasswordConfirmErrorMessage(values),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = getSignupErrors(values);
    setErrors(nextErrors);

    if (hasValidationError(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      let profileImage = "";
      let shouldUploadAfterSignup = false;

      if (profileImageFile) {
        try {
          const imageResponse = await imageApi.uploadImage(profileImageFile);
          profileImage = getImageUrlFromResponse(imageResponse);
        } catch (error) {
          if (!isLoginRequiredMessage(error.message)) {
            throw error;
          }

          shouldUploadAfterSignup = true;
        }
      }

      await authApi.signup({
        email: values.email.trim(),
        password: values.password.trim(),
        nickname: values.nickname.trim(),
        profileImage,
      });

      if (profileImageFile && shouldUploadAfterSignup) {
        const signinResponse = await authApi.signin({
          email: values.email.trim(),
          password: values.password.trim(),
        });

        setAuthSession({
          userId: getSigninUserId(signinResponse),
          accessToken: getSigninAccessToken(signinResponse),
        });

        const imageResponse = await imageApi.uploadImage(profileImageFile);
        const uploadedProfileImage = getImageUrlFromResponse(imageResponse);

        await userApi.updateMyProfile({
          nickname: values.nickname.trim(),
          profileImage: uploadedProfileImage,
        });

        clearAuthSession();
      }

      alert("회원가입이 완료되었습니다.");
      navigate(ROUTES.login);
    } catch (error) {
      const message = error.message;

      if (message.includes("이메일")) {
        setErrors((current) => ({ ...current, email: `*${message}` }));
        return;
      }

      if (message.includes("닉네임")) {
        setErrors((current) => ({ ...current, nickname: `*${message}` }));
        return;
      }

      setErrors((current) => ({ ...current, email: `*${message}` }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-2" noValidate onSubmit={handleSubmit}>
      <ProfileImagePicker
        file={profileImageFile}
        onChange={setProfileImageFile}
      />

      <AuthField
        id="signupEmail"
        label="이메일"
        icon="mail"
        type="email"
        autoComplete="email"
        placeholder="이메일을 입력하세요"
        required
        value={values.email}
        errorMessage={errors.email}
        onBlur={() => validateField("email")}
        onChange={(value) => updateValue("email", value)}
      />
      <AuthField
        id="signupNickname"
        label="닉네임"
        icon="badge"
        autoComplete="nickname"
        placeholder="닉네임을 입력하세요"
        required
        value={values.nickname}
        errorMessage={errors.nickname}
        onBlur={() => validateField("nickname")}
        onChange={(value) => updateValue("nickname", value)}
      />
      <AuthField
        id="signupPassword"
        label="비밀번호"
        icon="lock"
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호를 입력하세요"
        required
        value={values.password}
        errorMessage={errors.password}
        onBlur={() => validateField("password")}
        onChange={(value) => updateValue("password", value)}
        showPassword={showPassword}
        onToggleVisibility={() => setShowPassword((current) => !current)}
      />
      <AuthField
        id="signupPasswordConfirm"
        label="비밀번호 확인"
        icon="check_circle"
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호를 다시 입력하세요"
        required
        value={values.passwordConfirm}
        errorMessage={errors.passwordConfirm}
        onBlur={() => validateField("passwordConfirm")}
        onChange={(value) => updateValue("passwordConfirm", value)}
        showPassword={showPasswordConfirm}
        onToggleVisibility={() => setShowPasswordConfirm((current) => !current)}
      />

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
          {isSubmitting ? "가입 중..." : "회원가입"}
        </span>
      </button>
    </form>
  );
};

export default SignupForm;
