import { useRef, useState } from "react";
import { getFullImageUrl } from "@/api";
import Icon from "@/components/common/Icon";
import { useImagePreview } from "@/hooks/useImagePreview";

const ProfileImagePicker = ({
  currentImageUrl = "",
  file,
  onChange,
  onRemove,
  size = "md",
}) => {
  const inputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const selectedPreviewUrl = useImagePreview(file);
  const previewUrl =
    selectedPreviewUrl || (currentImageUrl ? getFullImageUrl(currentImageUrl) : "");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 선택할 수 있습니다.");
      event.target.value = "";
      onChange(null);
      return;
    }

    setErrorMessage("");
    onChange(selectedFile);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setErrorMessage("");
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onRemove?.();
  };

  const imageStyle = previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined;
  const sizeClass = size === "lg" ? "h-28 w-28" : "h-24 w-24";
  const canRemove = Boolean(previewUrl);
  const canChangeByImageClick = size !== "lg" && previewUrl;

  return (
    <div className="text-center">
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div
        className={`group relative mx-auto flex ${sizeClass} flex-col items-center justify-center overflow-visible rounded-full bg-[#edeeef] bg-cover bg-center bg-no-repeat text-[#5f5e5e] transition`}
        style={imageStyle}
      >
        {!previewUrl && (
          <button
            type="button"
            className="absolute inset-0 flex flex-col items-center justify-center rounded-full transition hover:bg-[#e7e8e9] active:scale-95"
            aria-label="프로필 사진 등록"
            onClick={openFilePicker}
          >
            <Icon className="text-3xl">add</Icon>
            <span className="text-xs font-semibold">Upload</span>
          </button>
        )}
        {canRemove && (
          <button
            type="button"
            className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-full bg-black/35 text-white opacity-0 transition group-hover:opacity-100"
            aria-label="프로필 사진 삭제"
            onClick={handleRemove}
          >
            <span className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold leading-4">
              삭제
            </span>
          </button>
        )}
        {canChangeByImageClick && (
          <button
            type="button"
            className="absolute inset-0 rounded-full transition hover:bg-black/10 active:scale-95"
            aria-label="프로필 사진 변경"
            onClick={openFilePicker}
          />
        )}
        {size === "lg" && (
          <button
            type="button"
            className="absolute bottom-1 right-1 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#b71422] text-white transition active:scale-95"
            aria-label="새 프로필 사진 등록"
            onClick={openFilePicker}
          >
            <Icon className="text-[16px]">edit</Icon>
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-[#5f5e5e]">프로필 사진을 등록하세요</p>
      <p
        className={`mt-1 min-h-5 text-xs leading-5 text-[#ba1a1a] ${
          errorMessage ? "visible" : "invisible"
        }`}
      >
        {errorMessage || "."}
      </p>
    </div>
  );
};

export default ProfileImagePicker;
