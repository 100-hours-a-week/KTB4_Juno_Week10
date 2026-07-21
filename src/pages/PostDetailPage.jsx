import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { commentApi, getCurrentUserId, getFullImageUrl, postApi } from "@/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import Icon from "@/components/common/Icon";
import { ROUTES } from "@/constants/routes";
import CommentForm from "@/features/posts/CommentForm";
import CommentList from "@/features/posts/CommentList";
import LikeButton from "@/features/posts/LikeButton";
import { formatCount } from "@/utils/format";
import { isOwner } from "@/utils/auth";
import { pickField } from "@/utils/object";
import {
  getPostFromResponse,
  isWithdrawnAuthorNickname,
  normalizePostDetail,
} from "@/utils/normalizers";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const [post, setPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPost = useCallback(async () => {
    if (!postId) {
      setErrorMessage("게시글 정보를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await postApi.getPost(postId);
      setPost(normalizePostDetail(getPostFromResponse(response)));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const refreshPostQuietly = useCallback(async () => {
    if (!postId) {
      return;
    }

    const response = await postApi.getPost(postId);
    const nextPost = normalizePostDetail(getPostFromResponse(response));

    setPost((current) => {
      if (!current) {
        return nextPost;
      }

      return {
        ...current,
        commentCount: nextPost.commentCount,
        comments: nextPost.comments,
      };
    });
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const isPostOwner = useMemo(() => {
    return isOwner(post?.authorId, currentUserId);
  }, [currentUserId, post?.authorId]);

  const handleToggleLike = async () => {
    if (!post || isLikeProcessing) {
      return;
    }

    setIsLikeProcessing(true);

    try {
      const previousLiked = post.liked;
      const previousLikeCount = Number(post.likeCount ?? 0);
      const fallbackLiked = !previousLiked;
      const fallbackLikeCount = previousLiked
        ? Math.max(previousLikeCount - 1, 0)
        : previousLikeCount + 1;
      const response = previousLiked
        ? await postApi.unlikePost(post.id)
        : await postApi.likePost(post.id);

      setPost((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          liked: pickField(response?.data, "liked", "isLiked", "is_liked") ?? fallbackLiked,
          likeCount:
            pickField(response?.data, "likeCount", "like_count") ??
            fallbackLikeCount,
        };
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLikeProcessing(false);
    }
  };

  const handleSubmitComment = async (content) => {
    if (!postId) {
      return;
    }

    setIsCommentSubmitting(true);

    try {
      if (editingComment) {
        await commentApi.updateComment(postId, editingComment.id, content);
      } else {
        await commentApi.createComment(postId, content);
      }

      setEditingComment(null);
      await refreshPostQuietly();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleConfirmDeleteComment = async () => {
    if (!postId || !deletingComment) {
      return;
    }

    setIsDeleting(true);

    try {
      await commentApi.deleteComment(postId, deletingComment.id);
      setDeletingComment(null);
      await refreshPostQuietly();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeletePost = async () => {
    if (!post?.id) {
      return;
    }

    setIsDeleting(true);

    try {
      await postApi.deletePost(post.id);
      navigate(ROUTES.posts);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsDeleting(false);
      setIsDeletePostModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f9fa] px-5 pb-10 pt-20">
        <section className="mx-auto w-full max-w-[896px] rounded-xl bg-white p-6 text-center text-[#5f5e5e]">
          게시글을 불러오는 중입니다.
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#f8f9fa] px-5 pb-10 pt-20">
        <section className="mx-auto w-full max-w-[896px] rounded-xl border border-[#e4beba] bg-white p-6 text-center">
          <p className="font-semibold text-[#ba1a1a]">
            게시글을 불러오지 못했습니다.
          </p>
          <p className="mt-2 text-sm text-[#5f5e5e]">{errorMessage}</p>
        </section>
      </main>
    );
  }

  const authorImageStyle = post.authorProfileImage
    ? { backgroundImage: `url(${getFullImageUrl(post.authorProfileImage)})` }
    : undefined;
  const isWithdrawnAuthor = isWithdrawnAuthorNickname(post.authorNickname);
  const editPath = ROUTES.postEdit.replace(":postId", post.id);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-5 pb-10 pt-20">
      <section className="mx-auto w-full max-w-[896px]">
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-[#e4beba] bg-white p-4 text-sm text-[#ba1a1a]">
            {errorMessage}
          </div>
        )}

        <article className="w-full overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.05)]">
          {post.image && (
            <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-[#e7e8e9]">
              <img
                className="block h-full w-full object-cover"
                src={getFullImageUrl(post.image)}
                alt="게시글 이미지"
              />
            </div>
          )}

          <div className="p-6 max-sm:p-4">
            <div className="flex w-full items-start justify-between gap-5 max-sm:flex-col">
              <div className="min-w-0 flex-1">
                <h2 className="break-words font-['Plus_Jakarta_Sans'] text-2xl font-bold leading-8 tracking-normal text-[#191c1d]">
                  {post.title}
                </h2>
                <div className="mt-3 flex items-center gap-2.5">
                  <span
                    className="h-9 w-9 shrink-0 rounded-full bg-[#e7e8e9] bg-cover bg-center bg-no-repeat"
                    style={authorImageStyle}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span
                      className={`max-w-[220px] truncate text-sm font-bold leading-5 ${
                        isWithdrawnAuthor ? "text-[#a9a9a9]" : "text-[#9c2600]"
                      }`}
                    >
                      {post.authorNickname}
                    </span>
                    <time className="text-xs leading-4 text-[#5f5e5e]">
                      {post.createdAt}
                    </time>
                  </div>
                </div>
              </div>

              {isPostOwner && (
                <div className="flex shrink-0 items-center gap-2 max-sm:self-end">
                  <Link
                    to={editPath}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4beba] text-[#5f5e5e] transition hover:bg-[#e7e8e9] hover:text-[#9c2600] active:scale-95"
                    aria-label="게시글 수정"
                  >
                    <Icon className="text-[21px]">edit</Icon>
                  </Link>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4beba] text-[#ba1a1a] transition hover:bg-[#ffdad6] hover:text-[#93000a] active:scale-95"
                    aria-label="게시글 삭제"
                    onClick={() => setIsDeletePostModalOpen(true)}
                  >
                    <Icon className="text-[21px]">delete</Icon>
                  </button>
                </div>
              )}
            </div>

            <p className="mt-6 min-h-[100px] whitespace-pre-wrap break-words text-lg leading-7 text-[#5b403e] max-sm:text-base max-sm:leading-6">
              {post.content}
            </p>

            <div className="mt-6 flex w-full items-center gap-6 border-t border-[#e4beba]/45 pt-4 max-sm:gap-4 max-sm:overflow-x-auto">
              <LikeButton
                liked={post.liked}
                likeCount={post.likeCount}
                disabled={isLikeProcessing}
                onClick={handleToggleLike}
              />
              <div className="flex min-w-0 items-center gap-2 text-[#5f5e5e]">
                <Icon className="text-[22px]">forum</Icon>
                <span className="text-sm font-semibold leading-5">
                  {formatCount(post.commentCount)}
                </span>
              </div>
              <div className="flex min-w-0 items-center gap-2 text-[#5f5e5e]">
                <Icon className="text-[22px]">visibility</Icon>
                <span className="text-sm font-semibold leading-5">
                  {formatCount(post.viewCount)}
                </span>
              </div>
            </div>
          </div>
        </article>

        <section className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xl font-semibold leading-7 text-[#191c1d]">
            댓글
            <span className="inline-flex h-[22px] min-w-7 items-center justify-center rounded-full bg-[#e7e8e9] px-2 text-xs font-semibold leading-4 text-[#5f5e5e]">
              {formatCount(post.commentCount)}
            </span>
          </h3>

          <CommentForm
            key={editingComment?.id ?? "create-comment"}
            editingComment={editingComment}
            isSubmitting={isCommentSubmitting}
            onCancelEdit={() => setEditingComment(null)}
            onSubmit={handleSubmitComment}
          />

          <CommentList
            comments={post.comments}
            currentUserId={currentUserId}
            onEdit={setEditingComment}
            onDelete={setDeletingComment}
          />
        </section>
      </section>

      <ConfirmModal
        isOpen={isDeletePostModalOpen}
        title="게시글을 삭제하시겠습니까?"
        description="삭제한 게시글은 복구할 수 없습니다."
        confirmLabel="삭제"
        isConfirming={isDeleting}
        onCancel={() => setIsDeletePostModalOpen(false)}
        onConfirm={handleConfirmDeletePost}
      />

      <ConfirmModal
        isOpen={Boolean(deletingComment)}
        title="댓글을 삭제하시겠습니까?"
        description="삭제한 댓글은 복구할 수 없습니다."
        confirmLabel="삭제"
        isConfirming={isDeleting}
        onCancel={() => setDeletingComment(null)}
        onConfirm={handleConfirmDeleteComment}
      />
    </main>
  );
};

export default PostDetailPage;
