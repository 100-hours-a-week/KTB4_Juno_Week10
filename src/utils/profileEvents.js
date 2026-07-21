const PROFILE_UPDATED_EVENT = "profile:updated";

export const dispatchProfileUpdated = (profile) => {
  window.dispatchEvent(
    new CustomEvent(PROFILE_UPDATED_EVENT, {
      detail: profile,
    }),
  );
};

export const subscribeProfileUpdated = (handler) => {
  window.addEventListener(PROFILE_UPDATED_EVENT, handler);

  return () => {
    window.removeEventListener(PROFILE_UPDATED_EVENT, handler);
  };
};
