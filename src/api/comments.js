import { request } from "./client";

export const createComment = (postId, content) => {
  return request(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};

export const updateComment = (postId, commentId, content) => {
  return request(`/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });
};

export const deleteComment = (postId, commentId) => {
  return request(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });
};
