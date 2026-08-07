import { useNavigate } from "react-router-dom";
import { postApi } from "@/api";
import { ROUTES } from "@/constants/routes";
import PostForm from "@/features/posts/PostForm";
import { getPostIdFromResponse } from "@/utils/normalizers";

const PostCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const response = await postApi.createPost(formData);
    const postId = getPostIdFromResponse(response);

    if (postId) {
      navigate(ROUTES.postDetail.replace(":postId", postId));
      return;
    }

    navigate(ROUTES.posts);
  };

  return (
    <main className="min-h-screen px-5 pb-0 pt-[88px]">
      <section className="mx-auto w-full max-w-[672px]">
        <div className="mb-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold leading-[38px] text-[#191c1d]">
            여기서 새로운 글을
            <br />
            작성할 수 있어요!
          </h2>
          <p className="mt-2 text-base leading-6 text-[#5f5e5e]">
            당신의 추천 소스 조합은 무엇인가요?
          </p>
        </div>

        <PostForm mode="create" onSubmit={handleSubmit} />
      </section>
    </main>
  );
};

export default PostCreatePage;
