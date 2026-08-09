import { useEffect, useState } from "react";
import { categoryApi, imageApi } from "@/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import FixedActionBar from "@/components/common/FixedActionBar";
import { ROUTES } from "@/constants/routes";
import { getImageUrlFromResponse } from "@/utils/normalizers";
import CategorySelector from "@/features/posts/CategorySelector";
import ImageDropzone from "@/features/posts/ImageDropzone";

const validatePostForm = ({ title, content }) => {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    return "*제목을 입력해주세요.";
  }

  if (trimmedTitle.length > 26) {
    return "*제목은 최대 26자까지 입력할 수 있습니다.";
  }

  if (!trimmedContent) {
    return "*내용을 입력해주세요.";
  }

  return "";
};

const PostForm = ({
  cancelTo = ROUTES.posts,
  initialCategoryIds = [],
  initialContent = "",
  initialImage = "",
  initialImageKey = "",
  initialTitle = "",
  mode = "create",
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] =
    useState(initialCategoryIds);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [currentImageKey, setCurrentImageKey] = useState(initialImageKey);
  const [isImageRemoved, setIsImageRemoved] = useState(!initialImage);
  const [helperMessage, setHelperMessage] = useState("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      setIsCategoryLoading(true);
      setCategoryErrorMessage("");

      try {
        const response = await categoryApi.getCategories();
        const responseCategories = response.data.categories ?? [];

        if (!ignore) {
          setCategories(responseCategories);
        }
      } catch (error) {
        if (!ignore) {
          setCategoryErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsCategoryLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      setAlertMessage("작성할 내용이 없습니다");
      return;
    }

    const validationMessage = validatePostForm({ title, content });

    if (validationMessage) {
      setHelperMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setHelperMessage("");

    try {
      let image = currentImageKey;

      if (isImageRemoved) {
        image = "";
      }

      if (selectedImage) {
        const imageResponse = await imageApi.uploadImage(selectedImage);
        image = getImageUrlFromResponse(imageResponse);
      }

      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        image,
        categoryIds: selectedCategoryIds,
      });
    } catch (error) {
      setHelperMessage(`*${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value.slice(0, 27));
    setHelperMessage("");
  };

  const handleImageChange = (file) => {
    setSelectedImage(file);

    if (file) {
      setIsImageRemoved(false);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setCurrentImage("");
    setCurrentImageKey("");
    setIsImageRemoved(true);
    setHelperMessage("");
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds((currentIds) => {
      if (currentIds.includes(categoryId)) {
        return currentIds.filter((id) => id !== categoryId);
      }

      if (currentIds.length >= 3) {
        return currentIds;
      }

      return [...currentIds, categoryId];
    });
  };

  return (
    <>
      <form
        id="postForm"
        className="flex w-full flex-col gap-6"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="w-full">
          <label
            className="mb-2 ml-1 block text-base font-semibold leading-6 tracking-[0.05em] text-[#191c1d]"
            htmlFor="postTitle"
          >
            제목<span className="ml-0.5 text-[#9c2600]">*</span>
          </label>
          <input
            id="postTitle"
            className="h-[52px] w-full rounded-xl border-[1.5px] border-[#e0e0e0] bg-white px-4 py-3 text-base leading-6 text-[#191c1d] placeholder:text-[#838486] transition focus:border-[#9c2600] focus:shadow-[0_0_0_1px_#9c2600]"
            placeholder="제목을 입력하세요 (예: 궁극의 마라맛 훠궈 소스)"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="w-full">
          <span className="mb-2 ml-1 block text-base font-semibold leading-6 tracking-[0.05em] text-[#191c1d]">
            대표 이미지
          </span>
          <ImageDropzone
            currentImageUrl={currentImage}
            file={selectedImage}
            isImageRemoved={isImageRemoved}
            onChange={handleImageChange}
            onError={setHelperMessage}
            onRemove={handleImageRemove}
          />
        </div>

        <div className="w-full">
          <label
            className="mb-2 ml-1 block text-base font-semibold leading-6 tracking-[0.05em] text-[#191c1d]"
            htmlFor="postContent"
          >
            내용<span className="ml-0.5 text-[#9c2600]">*</span>
          </label>
          <textarea
            id="postContent"
            className="h-[220px] w-full resize-none rounded-xl border-[1.5px] border-[#e0e0e0] bg-white px-4 py-3.5 text-base leading-6 text-[#191c1d] placeholder:text-[#838486] transition focus:border-[#9c2600] focus:shadow-[0_0_0_1px_#9c2600]"
            placeholder="나만의 특별한 레시피나 팁을 공유해주세요!"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setHelperMessage("");
            }}
          />
        </div>

        <CategorySelector
          categories={categories}
          disabled={isSubmitting}
          errorMessage={categoryErrorMessage}
          isLoading={isCategoryLoading}
          selectedCategoryIds={selectedCategoryIds}
          onToggle={handleCategoryToggle}
        />

        <p className="-mt-3 min-h-[18px] px-1 text-xs leading-[18px] text-[#ba1a1a]">
          {helperMessage}
        </p>
      </form>

      <FixedActionBar
        cancelTo={cancelTo}
        isSubmitting={isSubmitting}
        isSubmitDisabled={false}
        submitLabel={mode === "edit" ? "수정하기" : "작성하기"}
        submittingLabel={mode === "edit" ? "수정 중..." : "작성 중..."}
      />

      <ConfirmModal
        isOpen={Boolean(alertMessage)}
        title={alertMessage}
        confirmLabel="확인"
        showCancel={false}
        onConfirm={() => setAlertMessage("")}
      />
    </>
  );
};

export default PostForm;
