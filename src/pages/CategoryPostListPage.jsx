import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { categoryApi, postApi } from "@/api";
import CategoryPostCard from "@/features/categories/CategoryPostCard";
import { getPostsFromResponse } from "@/utils/normalizers";

const POST_PAGE_SIZE = 10;

const CategoryPostListPage = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const currentCategory = useMemo(() => {
    return categories.find(
      (category) => String(category.category_id) === String(categoryId),
    );
  }, [categories, categoryId]);

  useEffect(() => {
    if (!categoryId) {
      setErrorMessage("카테고리 정보를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    let ignore = false;

    const loadCategoryPosts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [categoryResponse, postResponse] = await Promise.all([
          categoryApi.getCategories(),
          postApi.getPosts({
            categoryIds: [categoryId],
            sort: "latest",
            page: 0,
            size: POST_PAGE_SIZE,
          }),
        ]);

        if (!ignore) {
          setCategories(categoryResponse.data.categories ?? []);
          setPosts(getPostsFromResponse(postResponse));
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
          setCategories([]);
          setPosts([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadCategoryPosts();

    return () => {
      ignore = true;
    };
  }, [categoryId]);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-5 pb-8 pt-24">
      <section className="mx-auto w-full max-w-[390px]">
        <div className="mb-6">
          <h2 className="truncate text-center text-xl font-normal leading-7 text-[#b71422]">
            #{currentCategory?.name ?? "카테고리"}
          </h2>
        </div>

        {isLoading && (
          <div className="rounded-[18px] bg-white p-6 text-center text-base text-[#5f5e5e]">
            게시글을 불러오는 중입니다.
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-[18px] border border-[#e4beba] bg-white p-6 text-center">
            <p className="text-base font-semibold text-[#ba1a1a]">
              게시글을 불러오지 못했습니다.
            </p>
            <p className="mt-2 text-sm text-[#5f5e5e]">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && posts.length === 0 && (
          <p className="mt-20 text-center text-base leading-6 text-[#5f5e5e]">
            해당 카테고리에 등록된 게시글이 없습니다.
          </p>
        )}

        {!isLoading && !errorMessage && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <CategoryPostCard
                key={post.post_id ?? post.postId ?? post.id}
                post={post}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CategoryPostListPage;
