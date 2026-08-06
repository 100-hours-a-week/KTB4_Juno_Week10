import { useEffect, useState } from "react";
import { categoryApi } from "@/api";
import { ROUTES } from "@/constants/routes";
import CategoryCard from "@/features/categories/CategoryCard";
import FeaturedPostSlider from "@/features/categories/FeaturedPostSlider";

const CATEGORY_DESCRIPTIONS = {
  "얼얼한 매운맛": "화끈한 마라와 고추기름의 만남",
  "달콤고소한 맛": "단짠단짠의 매력",
  "새콤상큼한 맛": "입맛 돋우는 식초와 설탕",
  "짭짤한 간장 맛": "깔끔하고 짭짤한 감칠맛",
  "고소한 참깨 맛": "땅콩과 참깨의 진한 고소함",
  "연예인 추천 조합": "실패 없는 인기 순위",
};

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await categoryApi.getCategories();

        if (!ignore) {
          setCategories(response.data.categories ?? []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
          setCategories([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="-mb-28 min-h-screen bg-[#fff4f4] px-5 pb-36 pt-24">
      <section className="mx-auto w-full max-w-[390px]">
        <FeaturedPostSlider />

        <h2 className="mb-4 text-[28px] font-bold leading-9 text-[#191c1d]">
          취향별 소스 모음
        </h2>

        {isLoading && (
          <div className="rounded-[28px] bg-white p-6 text-center text-base text-[#5f5e5e] shadow-[0_2px_6px_rgba(44,23,23,0.06)]">
            취향별 소스 모음을 불러오는 중입니다.
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-[28px] border border-[#e4beba] bg-white p-6 text-center">
            <p className="text-base font-semibold text-[#ba1a1a]"></p>
            <p className="mt-2 text-sm text-[#5f5e5e]">{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.category_id}
                category={category}
                description={CATEGORY_DESCRIPTIONS[category.name]}
                to={ROUTES.categoryPosts.replace(
                  ":categoryId",
                  category.category_id,
                )}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CategoryPage;
