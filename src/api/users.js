import { request } from "./client";

export const getMyProfile = () => request("/users/me");

export const updateMyProfile = ({ nickname, profileImage }) => {
  return request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({
      nickname,
      profile_image: profileImage,
    }),
  });
};

export const deleteMyAccount = () => {
  return request("/users/me", {
    method: "DELETE",
  });
};

export const updateMyPassword = (newPassword) => {
  return request("/users/me/password", {
    method: "PUT",
    body: JSON.stringify({
      new_password: newPassword,
    }),
  });
};

export const deleteMe = deleteMyAccount;

export const updatePassword = updateMyPassword;
