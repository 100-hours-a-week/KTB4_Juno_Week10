import { useRef, useState } from "react";
import { getFullImageUrl } from "../../api";
import Icon from "../../components/common/Icon";
import { useImagePreview } from "../../hooks/useImagePreview";

const ImageDropzone = ({
  currentImageUrl = "",
  file,
  isImageRemoved,
  onChange,
  onError,
  onRemove,
}) => {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const selectedPreviewUrl = useImagePreview(file);
  const previewUrl =
    selectedPreviewUrl || (!isImageRemoved && currentImageUrl ? getFullImageUrl(currentImageUrl) : "");
  const fileName = file
    ? file.name
    : previewUrl
      ? "기존 이미지"
      : "선택된 이미지가 없습니다.";

  const selectFile = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      onError("이미지 파일만 선택할 수 있습니다.");
      onChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    onError("");
    onChange(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onRemove();
  };

  return (
    <div>
      <div
        className={`relative flex h-[272px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-white transition ${
          isDragOver ? "border-[#9c2600] bg-[#f3f4f5]" : "border-[#e0e0e0] hover:border-[#9c2600] hover:bg-[#f3f4f5]"
        }`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />

        {!previewUrl && (
          <div className="flex flex-col items-center p-4 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffdad7]/70">
              <Icon className="text-3xl text-[#9c2600]">upload</Icon>
            </span>
            <p className="text-sm font-semibold leading-5 text-[#191c1d]">
              이미지를 업로드하세요
            </p>
            <p className="mt-1 text-xs leading-4 text-[#5f5e5e]">
              PNG 또는 JPG 이미지
            </p>
          </div>
        )}

        {previewUrl && (
          <div className="absolute inset-0">
            <img
              className="block h-full w-full object-cover"
              src={previewUrl}
              alt="선택한 게시글 이미지"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
              <button
                type="button"
                className="flex min-h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-[#9c2600]"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemove();
                }}
              >
                <Icon className="text-[19px]">delete</Icon>
                이미지 삭제
              </button>
            </div>
          </div>
        )}
      </div>

      <span className="mt-2 block truncate px-1 text-xs leading-4 text-[#5f5e5e]">
        {fileName}
      </span>
    </div>
  );
};

export default ImageDropzone;
