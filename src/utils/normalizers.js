import { pickField } from "./object";

export const WITHDRAWN_AUTHOR_NICKNAME = "(탈퇴한 사용자)";

export const getImageUrlFromResponse = (response) => {
  return (
    pickField(
      response?.data,
      "imageUrl",
      "image_url",
      "profileImage",
      "profile_image",
    ) ?? ""
  );
};

export const getSigninAccessToken = (response) => {
  return pickField(response?.data, "accessToken", "access_token") ?? "";
};

export const getSigninUserId = (response) => {
  return pickField(response?.data, "userId", "user_id") ?? "";
};

export const getPostId = (post) => pickField(post, "postId", "post_id", "id");

export const getPostIdFromResponse = (response) => {
  const data = response?.data ?? response;
  const post =
    pickField(data, "post", "createdPost", "created_post", "data") ?? data;

  return getPostId(post);
};

export const getPostsFromResponse = (response) => {
  const posts = pickField(response?.data, "posts", "postList", "post_list");

  if (Array.isArray(posts)) {
    return posts;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response)) {
    return response;
  }

  return [];
};

export const normalizeAuthorNickname = (nickname) => {
  const value = String(nickname ?? "").trim();

  if (!value) {
    return "";
  }

  if (/^deleted_?user/i.test(value) || /^deleted_/i.test(value)) {
    return WITHDRAWN_AUTHOR_NICKNAME;
  }

  return value;
};

export const isWithdrawnAuthorNickname = (nickname) => {
  return nickname === WITHDRAWN_AUTHOR_NICKNAME;
};

export const normalizePostListItem = (post) => {
  return {
    id: getPostId(post),
    title: pickField(post, "title") ?? "",
    content: pickField(post, "content") ?? "",
    image: pickField(post, "image", "imageUrl", "image_url") ?? "",
    authorNickname: normalizeAuthorNickname(
      pickField(post, "authorNickname", "author_nickname", "nickname"),
    ),
    authorProfileImage:
      pickField(
        post,
        "authorProfileImage",
        "author_profile_image",
        "profileImage",
        "profile_image",
      ) ?? "",
    createdAt: pickField(post, "createdAt", "created_at") ?? "",
    likeCount: pickField(post, "likeCount", "like_count") ?? 0,
    commentCount: pickField(post, "commentCount", "comment_count") ?? 0,
    viewCount: pickField(post, "viewCount", "view_count") ?? 0,
  };
};

export const getPostFromResponse = (response) =>
  response?.data ?? response ?? null;

export const normalizeComment = (comment) => {
  return {
    id: getCommentId(comment),
    authorId: getAuthorId(comment),
    authorNickname: normalizeAuthorNickname(
      pickField(comment, "authorNickname", "author_nickname", "nickname"),
    ),
    authorProfileImage:
      pickField(
        comment,
        "authorProfileImage",
        "author_profile_image",
        "profileImage",
        "profile_image",
      ) ?? "",
    content: pickField(comment, "content") ?? "",
    createdAt: pickField(comment, "createdAt", "created_at") ?? "",
  };
};

export const normalizePostDetail = (post) => {
  const comments =
    pickField(post, "comments", "commentList", "comment_list") ?? [];
  const normalizedComments = Array.isArray(comments)
    ? comments.map(normalizeComment)
    : [];

  return {
    id: getPostId(post),
    authorId: getAuthorId(post),
    title: pickField(post, "title") ?? "",
    content: pickField(post, "content") ?? "",
    image: pickField(post, "image", "imageUrl", "image_url") ?? "",
    authorNickname: normalizeAuthorNickname(
      pickField(post, "nickname", "authorNickname", "author_nickname"),
    ),
    authorProfileImage:
      pickField(
        post,
        "profileImage",
        "profile_image",
        "authorProfileImage",
        "author_profile_image",
      ) ?? "",
    createdAt: pickField(post, "createdAt", "created_at") ?? "",
    likeCount: pickField(post, "likeCount", "like_count") ?? 0,
    commentCount:
      pickField(post, "commentCount", "comment_count") ??
      normalizedComments.length,
    viewCount: pickField(post, "viewCount", "view_count") ?? 0,
    liked: Boolean(pickField(post, "liked", "isLiked", "is_liked")),
    comments: normalizedComments,
  };
};

export const normalizePostFormData = (post) => {
  return {
    id: getPostId(post),
    title: pickField(post, "title") ?? "",
    content: pickField(post, "content") ?? "",
    image: pickField(post, "image", "imageUrl", "image_url") ?? "",
  };
};

export const normalizeMyProfile = (user) => {
  return {
    id: pickField(user, "userId", "user_id", "id") ?? "",
    email: pickField(user, "email") ?? "",
    nickname: pickField(user, "nickname") ?? "",
    profileImage: pickField(user, "profileImage", "profile_image") ?? "",
  };
};

export const getCommentId = (comment) => {
  return pickField(comment, "commentId", "comment_id", "id");
};

export const getAuthorId = (source) => {
  return pickField(source, "authorId", "author_id", "userId", "user_id");
};

export const getProfileImage = (source) => {
  return pickField(
    source,
    "profileImage",
    "profile_image",
    "authorProfileImage",
    "author_profile_image",
  );
};
