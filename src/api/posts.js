import { request } from "@/api/client";

export const getPosts = () => request("/posts");

export const getPost = (postId) => request(`/posts/${postId}`);

export const createPost = ({ title, content, image }) => {
  return request("/posts", {
    method: "POST",
    body: JSON.stringify({ title, content, image }),
  });
};

export const updatePost = (postId, { title, content, image }) => {
  return request(`/posts/${postId}`, {
    method: "PATCH",
    body: JSON.stringify({ title, content, image }),
  });
};

export const deletePost = (postId) => {
  return request(`/posts/${postId}`, {
    method: "DELETE",
  });
};

export const addLike = (postId) => {
  return request(`/posts/${postId}/likes`, {
    method: "POST",
  });
};

export const deleteLike = (postId) => {
  return request(`/posts/${postId}/likes`, {
    method: "DELETE",
  });
};

export const likePost = addLike;

export const unlikePost = deleteLike;
