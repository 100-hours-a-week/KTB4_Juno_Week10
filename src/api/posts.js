import { request } from "@/api/client";

export const getPosts = ({
  categoryIds = [],
  keyword = "",
  sort = "latest",
  page = 0,
  size = 10,
} = {}) => {
  const params = new URLSearchParams();

  if (keyword.trim()) {
    params.set("keyword", keyword.trim());
  }

  if (categoryIds.length > 0) {
    params.set("categoryIds", categoryIds.join(","));
  }

  params.set("sort", sort);
  params.set("page", String(page));
  params.set("size", String(size));

  return request(`/posts?${params.toString()}`);
};

export const getPost = (postId) => request(`/posts/${postId}`);

export const createPost = ({ title, content, image, categoryIds = [] }) => {
  return request("/posts", {
    method: "POST",
    body: JSON.stringify({ title, content, image, categoryIds }),
  });
};

export const updatePost = (
  postId,
  { title, content, image, categoryIds = [] },
) => {
  return request(`/posts/${postId}`, {
    method: "PATCH",
    body: JSON.stringify({ title, content, image, categoryIds }),
  });
};

export const deletePost = (postId) => {
  return request(`/posts/${postId}`, {
    method: "DELETE",
  });
};

export const addBookmark = (postId) => {
  return request(`/posts/${postId}/bookmarks`, {
    method: "POST",
  });
};

export const deleteBookmark = (postId) => {
  return request(`/posts/${postId}/bookmarks`, {
    method: "DELETE",
  });
};

export const bookmarkPost = addBookmark;

export const unbookmarkPost = deleteBookmark;
