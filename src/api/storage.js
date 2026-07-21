import { STORAGE_KEYS } from "../constants/config";

export const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.accessToken);

export const getCurrentUserId = () => localStorage.getItem(STORAGE_KEYS.userId);

export const isAuthenticated = () => Boolean(getAccessToken());

export const setAuthSession = ({ accessToken, userId }) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  }

  if (userId) {
    localStorage.setItem(STORAGE_KEYS.userId, userId);
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.userId);
};
