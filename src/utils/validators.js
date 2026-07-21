export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signupEmailRegex = /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.[A-Za-z]+$/;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,20}$/;

export const hasSpace = (value) => /\s/.test(value);

export const isValidNickname = (nickname) => {
  return Boolean(nickname && !hasSpace(nickname) && nickname.length <= 10);
};

export const isValidPostForm = ({ title, content }) => {
  return Boolean(title?.trim() && title.trim().length <= 26 && content?.trim());
};

export const getLoginErrorMessage = ({ email, password }) => {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail) {
    return "* 이메일을 입력해주세요.";
  }

  if (!emailRegex.test(trimmedEmail)) {
    return "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@adapterz.kr)";
  }

  if (!trimmedPassword) {
    return "* 비밀번호를 입력해주세요.";
  }

  if (!passwordRegex.test(trimmedPassword)) {
    return "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  return "";
};

export const getSignupEmailErrorMessage = (email) => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return "*이메일을 입력해주세요.";
  }

  if (!signupEmailRegex.test(trimmedEmail)) {
    return "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
  }

  return "";
};

export const getSignupPasswordErrorMessage = (password) => {
  const trimmedPassword = password.trim();

  if (!trimmedPassword) {
    return "*비밀번호를 입력해주세요.";
  }

  if (!passwordRegex.test(trimmedPassword)) {
    return "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  return "";
};

export const getSignupPasswordConfirmErrorMessage = ({
  password,
  passwordConfirm,
}) => {
  const trimmedPassword = password.trim();
  const trimmedPasswordConfirm = passwordConfirm.trim();

  if (!trimmedPasswordConfirm) {
    return "*비밀번호를 한 번 더 입력해주세요.";
  }

  if (trimmedPassword !== trimmedPasswordConfirm) {
    return "*비밀번호가 다릅니다.";
  }

  return "";
};

export const getSignupNicknameErrorMessage = (nickname) => {
  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) {
    return "*닉네임을 입력해주세요.";
  }

  if (hasSpace(trimmedNickname)) {
    return "*띄어쓰기를 없애주세요.";
  }

  if (trimmedNickname.length > 10) {
    return "*닉네임은 최대 10자까지 작성 가능합니다.";
  }

  return "";
};

export const getSignupErrors = ({
  email,
  password,
  passwordConfirm,
  nickname,
}) => {
  return {
    email: getSignupEmailErrorMessage(email),
    password: getSignupPasswordErrorMessage(password),
    passwordConfirm: getSignupPasswordConfirmErrorMessage({
      password,
      passwordConfirm,
    }),
    nickname: getSignupNicknameErrorMessage(nickname),
  };
};

export const hasValidationError = (errors) => {
  return Object.values(errors).some(Boolean);
};

export const getProfileNicknameErrorMessage = (nickname) => {
  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) {
    return "*닉네임을 입력해주세요.";
  }

  if (hasSpace(trimmedNickname)) {
    return "*닉네임에는 공백을 사용할 수 없습니다.";
  }

  if (trimmedNickname.length > 10) {
    return "*닉네임은 최대 10자까지 작성 가능합니다.";
  }

  return "";
};

export const getProfilePasswordErrors = ({ password, passwordConfirm }) => {
  const trimmedPassword = password.trim();
  const trimmedPasswordConfirm = passwordConfirm.trim();
  const errors = {
    password: "",
    passwordConfirm: "",
  };

  if (!trimmedPassword) {
    errors.password = "*새 비밀번호를 입력해주세요.";
    return errors;
  }

  if (!passwordRegex.test(trimmedPassword)) {
    errors.password =
      "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return errors;
  }

  if (!trimmedPasswordConfirm) {
    errors.passwordConfirm = "*새 비밀번호를 한 번 더 입력해주세요.";
    return errors;
  }

  if (trimmedPassword !== trimmedPasswordConfirm) {
    errors.passwordConfirm = "*비밀번호가 일치하지 않습니다.";
  }

  return errors;
};

export const getProfilePasswordLiveErrors = ({ password, passwordConfirm }) => {
  const trimmedPassword = password.trim();
  const trimmedPasswordConfirm = passwordConfirm.trim();
  const errors = {
    password: "",
    passwordConfirm: "",
  };

  if (trimmedPassword && !passwordRegex.test(trimmedPassword)) {
    errors.password =
      "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  if (
    trimmedPassword &&
    trimmedPasswordConfirm &&
    trimmedPassword !== trimmedPasswordConfirm
  ) {
    errors.passwordConfirm = "*비밀번호가 일치하지 않습니다.";
  }

  return errors;
};
