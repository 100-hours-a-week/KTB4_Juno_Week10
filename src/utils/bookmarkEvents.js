const BOOKMARK_UNREAD_EVENT = "bookmark:unread-changed";
const BOOKMARK_UNREAD_STORAGE_KEY = "hasUnreadBookmarks";

const dispatchBookmarkUnreadChanged = (hasUnread) => {
  window.dispatchEvent(
    new CustomEvent(BOOKMARK_UNREAD_EVENT, {
      detail: { hasUnread },
    }),
  );
};

export const hasUnreadBookmarks = () => {
  return localStorage.getItem(BOOKMARK_UNREAD_STORAGE_KEY) === "true";
};

export const markBookmarkUnread = () => {
  localStorage.setItem(BOOKMARK_UNREAD_STORAGE_KEY, "true");
  dispatchBookmarkUnreadChanged(true);
};

export const markBookmarkRead = () => {
  localStorage.removeItem(BOOKMARK_UNREAD_STORAGE_KEY);
  dispatchBookmarkUnreadChanged(false);
};

export const subscribeBookmarkUnreadChanged = (handler) => {
  window.addEventListener(BOOKMARK_UNREAD_EVENT, handler);

  return () => {
    window.removeEventListener(BOOKMARK_UNREAD_EVENT, handler);
  };
};
