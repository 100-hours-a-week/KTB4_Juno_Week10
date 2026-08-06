import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { categoryApi, postApi } from "@/api";
import { getCategoryStyle } from "@/constants/categoryStyles";
import CategoryPostCard from "@/features/categories/CategoryPostCard";
import { getPostsFromResponse } from "@/utils/normalizers";

const POST_PAGE_SIZE = 10;

const CategoryPostListPage = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const categoryNameFromState = location.state?.categoryName;
  const [posts, setPosts] = useState([]);
  const [fetchedCategoryTitle, setFetchedCategoryTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const hasCategoryId = Boolean(categoryId);
  const categoryTitle =
    categoryNameFromState ||
    fetchedCategoryTitle ||
    "취향의 소스들을 한 곳에서 모아봐요!";
  const categoryTitleStyle = getCategoryStyle(categoryTitle);
  const currentErrorMessage = hasCategoryId
    ? errorMessage
    : "카테고리 정보를 찾을 수 없습니다.";

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    let ignore = false;

    const loadCategoryPosts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const postResponse = await postApi.getPosts({
          categoryIds: [categoryId],
          sort: "latest",
          page: 0,
          size: POST_PAGE_SIZE,
        });

        if (!ignore) {
          setPosts(getPostsFromResponse(postResponse));
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
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

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    if (categoryNameFromState) {
      return;
    }

    let ignore = false;

    const loadCategoryTitle = async () => {
      try {
        const response = await categoryApi.getCategories();
        const category = (response.data.categories ?? []).find(
          (item) => String(item.category_id) === String(categoryId),
        );

        if (!ignore) {
          setFetchedCategoryTitle(
            category?.name ?? "취향의 소스들을 한 곳에서 모아봐요!",
          );
        }
      } catch {
        if (!ignore) {
          setFetchedCategoryTitle("취향의 소스들을 한 곳에서 모아봐요!");
        }
      }
    };

    void loadCategoryTitle();

    return () => {
      ignore = true;
    };
  }, [categoryId, categoryNameFromState]);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-5 pb-8 pt-24">
      <section className="mx-auto w-full max-w-[390px]">
        <h2
          className="mb-5 w-fit rounded-full px-4 py-2 text-2xl font-bold leading-8 max-sm:text-lg max-sm:leading-7"
          style={categoryTitleStyle}
        >
          # {categoryTitle}
        </h2>

        {hasCategoryId && isLoading && (
          <div className="rounded-[18px] bg-white p-6 text-center text-base text-[#5f5e5e]">
            게시글을 불러오는 중입니다.
          </div>
        )}

        {!hasCategoryId && (
          <div className="rounded-[18px] border border-[#e4beba] bg-white p-6 text-center">
            <p className="text-base font-semibold text-[#ba1a1a]">
              게시글을 불러오지 못했습니다.
            </p>
            <p className="mt-2 text-sm text-[#5f5e5e]">{currentErrorMessage}</p>
          </div>
        )}

        {hasCategoryId && !isLoading && errorMessage && (
          <div className="rounded-[18px] border border-[#e4beba] bg-white p-6 text-center">
            <p className="text-base font-semibold text-[#ba1a1a]">
              게시글을 불러오지 못했습니다.
            </p>
            <p className="mt-2 text-sm text-[#5f5e5e]">{currentErrorMessage}</p>
          </div>
        )}

        {hasCategoryId && !isLoading && !errorMessage && posts.length === 0 && (
          <p className="mt-20 text-center text-base leading-6 text-[#5f5e5e]">
            해당 카테고리에 등록된 게시글이 없습니다.
          </p>
        )}

        {hasCategoryId && !isLoading && !errorMessage && posts.length > 0 && (
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
