import { request } from "@/api/client";

export const signin = ({ email, password }) => {
  return request("/users/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const signup = ({ email, password, nickname, profileImage }) => {
  return request("/users/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      nickname,
      profile_image: profileImage,
    }),
  });
};

export const signout = () => {
  return request("/users/signout", {
    method: "POST",
  });
};
