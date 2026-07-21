import { useEffect, useMemo } from "react";

export const useImagePreview = (file) => {
  const previewUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);

  useEffect(() => {
    if (!previewUrl) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return previewUrl;
};
