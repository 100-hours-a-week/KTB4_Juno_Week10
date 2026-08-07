import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { commentApi, getCurrentUserId, getFullImageUrl, postApi } from "@/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import Icon from "@/components/common/Icon";
import { ROUTES } from "@/constants/routes";
import CommentForm from "@/features/posts/CommentForm";
import CommentList from "@/features/posts/CommentList";
import PostCategoryTags from "@/features/posts/PostCategoryTags";
import { formatCount } from "@/utils/format";
import { isOwner } from "@/utils/auth";
import { markBookmarkRead, markBookmarkUnread } from "@/utils/bookmarkEvents";
import { pickField } from "@/utils/object";
import { getPostFromResponse, normalizePostDetail } from "@/utils/normalizers";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const [post, setPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarkProcessing, setIsBookmarkProcessing] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!postId) {
      throw new Error("게시글 정보를 찾을 수 없습니다.");
    }

    const response = await postApi.getPost(postId);
    return normalizePostDetail(getPostFromResponse(response));
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
    let ignore = false;

    const loadPost = async () => {
      try {
        const nextPost = await fetchPost();

        if (!ignore) {
          setErrorMessage("");
          setPost(nextPost);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
          setPost(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      ignore = true;
    };
  }, [fetchPost]);

  const isPostOwner = useMemo(() => {
    return isOwner(post?.authorId, currentUserId);
  }, [currentUserId, post?.authorId]);

  const handleToggleBookmark = async () => {
    if (!post || isBookmarkProcessing) {
      return;
    }

    setIsBookmarkProcessing(true);

    try {
      const previousBookmarked = post.bookmarked;
      const previousBookmarkCount = Number(post.bookmarkCount ?? 0);
      const fallbackBookmarked = !previousBookmarked;
      const fallbackBookmarkCount = previousBookmarked
        ? Math.max(previousBookmarkCount - 1, 0)
        : previousBookmarkCount + 1;
      const response = previousBookmarked
        ? await postApi.unbookmarkPost(post.id)
        : await postApi.bookmarkPost(post.id);
      const nextBookmarked =
        pickField(response?.data, "bookmarked") ?? fallbackBookmarked;

      setPost((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          bookmarked: nextBookmarked,
          bookmarkCount:
            pickField(response?.data, "bookmark_count") ??
            fallbackBookmarkCount,
        };
      });

      if (!previousBookmarked && nextBookmarked) {
        markBookmarkUnread();
      }

      if (previousBookmarked && !nextBookmarked) {
        markBookmarkRead();
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsBookmarkProcessing(false);
    }
  };

  const handleSubmitComment = async (content) => {
    if (!postId) {
      throw new Error("게시글 정보를 찾을 수 없습니다.");
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
      throw error;
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
      <main className="min-h-screen px-5 pb-10 pt-20">
        <section className="mx-auto w-full max-w-[896px] rounded-xl bg-white p-6 text-center text-[#5f5e5e]">
          게시글을 불러오는 중입니다.
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen px-5 pb-10 pt-20">
        <section className="mx-auto w-full max-w-[896px] rounded-xl border border-[#e4beba] bg-white p-6 text-center">
          <p className="font-semibold text-[#ba1a1a]">
            게시글을 불러오지 못했습니다.
          </p>
          <p className="mt-2 text-sm text-[#5f5e5e]">{errorMessage}</p>
        </section>
      </main>
    );
  }

  const editPath = ROUTES.postEdit.replace(":postId", post.id);
  const bookmarkColorClass = post.bookmarked
    ? "text-[#c92525]"
    : "text-[#6b504c]";

  return (
    <main className="min-h-screen px-5 pb-[190px] pt-20">
      <section className="mx-auto w-full max-w-[560px]">
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-[#e4beba] bg-white p-4 text-sm text-[#ba1a1a]">
            {errorMessage}
          </div>
        )}

        <article className="flex w-full flex-col items-center text-center">
          {(post.image || isPostOwner) && (
            <div
              className={`relative inline-flex ${
                post.image ? "" : "w-full justify-end"
              }`}
            >
              {post.image && (
                <img
                  className="h-[190px] w-[190px] rounded-full object-cover max-sm:h-[170px] max-sm:w-[170px]"
                  src={getFullImageUrl(post.image)}
                  alt="게시글 이미지"
                />
              )}

              {isPostOwner && (
                <div
                  className={
                    post.image
                      ? "absolute left-full top-[-6px] ml-5"
                      : "relative"
                  }
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setIsPostMenuOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center bg-transparent text-[#5f5e5e] transition hover:text-[#9c2600] active:scale-95"
                    aria-label="게시글 메뉴"
                    aria-expanded={isPostMenuOpen}
                    aria-haspopup="menu"
                    onClick={() => setIsPostMenuOpen((current) => !current)}
                  >
                    <Icon style={{ fontSize: "34px" }}>more_horiz</Icon>
                  </button>

                  {isPostMenuOpen && (
                    <div
                      className="absolute right-0 top-11 z-20 w-24 overflow-hidden rounded-lg border border-[#eceef0] bg-white py-1 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
                      role="menu"
                    >
                      <Link
                        to={editPath}
                        className="block w-full px-3 py-2 text-left text-[12px] font-semibold leading-4 text-[#191c1d] hover:bg-[#f8f9fa]"
                        role="menuitem"
                        style={{ fontSize: "12px" }}
                        onClick={() => setIsPostMenuOpen(false)}
                      >
                        수정하기
                      </Link>
                      <button
                        type="button"
                        className="block w-full px-3 py-2 text-left text-[12px] font-semibold leading-4 text-[#ba1a1a] hover:bg-[#fff1f1]"
                        role="menuitem"
                        style={{ fontSize: "12px" }}
                        onClick={() => {
                          setIsPostMenuOpen(false);
                          setIsDeletePostModalOpen(true);
                        }}
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <h2 className="mt-6 w-full max-w-full whitespace-normal break-words text-xl font-semibold leading-7 tracking-normal text-[#191c1d]">
            {post.title}
          </h2>

          <div className="mt-3 flex items-center justify-center gap-6 text-[#6b504c]">
            <div className="flex items-center gap-1.5">
              <Icon style={{ fontSize: "26px" }}>visibility</Icon>
              <span className="text-base font-medium leading-6">
                {formatCount(post.viewCount)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon style={{ fontSize: "26px" }}>chat_bubble_outline</Icon>
              <span className="text-base font-medium leading-6">
                {formatCount(post.commentCount)}
              </span>
            </div>
            <button
              type="button"
              className={`flex items-center gap-1.5 bg-transparent p-0 transition disabled:cursor-wait ${bookmarkColorClass}`}
              aria-busy={isBookmarkProcessing}
              onClick={handleToggleBookmark}
              disabled={isBookmarkProcessing}
            >
              <Icon filled={post.bookmarked} style={{ fontSize: "26px" }}>
                bookmark
              </Icon>
              <span className="text-base font-medium leading-6">
                {formatCount(post.bookmarkCount)}
              </span>
            </button>
          </div>

          <PostCategoryTags
            categories={post.categories}
            className="mt-8 justify-center gap-3"
          />

          <section className="mt-12 w-full text-left">
            <h3 className="flex items-center gap-2 text-xl font-semibold leading-7 text-[#191c1d]">
              <Icon className="text-[#c92525]" style={{ fontSize: "20px" }}>
                article
              </Icon>
              내용
            </h3>
            <p className="mt-3 min-h-10 whitespace-pre-wrap break-words rounded-3xl border border-[#e4e4e4] bg-white px-7 py-8 text-lg leading-8 text-[#6b403d] shadow-[0_2px_4px_rgba(0,0,0,0.04)] max-sm:px-5 max-sm:py-6 max-sm:text-base max-sm:leading-7">
              {post.content}
            </p>
          </section>
        </article>

        <section className="mt-10">
          <h3 className="mb-2 flex items-center gap-2 text-xl font-medium leading-7 text-[#191c1d]">
            <Icon className="text-[#c92525]" style={{ fontSize: "32px" }}>
              forum
            </Icon>
            댓글
            <span className="text-[#c92525]">
              {formatCount(post.commentCount)}
            </span>
          </h3>

          <CommentList
            comments={post.comments}
            currentUserId={currentUserId}
            onEdit={setEditingComment}
            onDelete={setDeletingComment}
          />

          <CommentForm
            key={editingComment?.id ?? "create-comment"}
            editingComment={editingComment}
            isSubmitting={isCommentSubmitting}
            onCancelEdit={() => setEditingComment(null)}
            onSubmit={handleSubmitComment}
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
