import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postApi } from "@/api";
import { ROUTES } from "@/constants/routes";
import PostForm from "@/features/posts/PostForm";
import {
  getPostFromResponse,
  normalizePostFormData,
} from "@/utils/normalizers";

const PostEditPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const detailPath = postId
    ? ROUTES.postDetail.replace(":postId", postId)
    : ROUTES.posts;

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
      setPost(normalizePostFormData(getPostFromResponse(response)));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleSubmit = async (formData) => {
    await postApi.updatePost(postId, formData);
    navigate(detailPath);
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-5 pb-4 pt-[88px]">
      <section className="mx-auto w-full max-w-[672px]">
        <div className="mb-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold leading-[38px] text-[#191c1d]">
            게시글 수정
          </h2>
          <p className="mt-2 text-base leading-6 text-[#5f5e5e]">
            작성한 게시글의 제목, 이미지, 내용을 수정할 수 있습니다.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-xl bg-white p-6 text-center text-[#5f5e5e]">
            게시글을 불러오는 중입니다.
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-xl border border-[#e4beba] bg-white p-6 text-center">
            <p className="font-semibold text-[#ba1a1a]">
              게시글을 불러오지 못했습니다.
            </p>
            <p className="mt-2 text-sm text-[#5f5e5e]">{errorMessage}</p>
          </div>
        )}

        {!isLoading && post && (
          <PostForm
            mode="edit"
            cancelTo={detailPath}
            initialTitle={post.title}
            initialContent={post.content}
            initialImage={post.image}
            onSubmit={handleSubmit}
          />
        )}
      </section>
    </main>
  );
};

export default PostEditPage;
