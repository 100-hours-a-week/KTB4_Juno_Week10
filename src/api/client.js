import { API_BASE_URL } from "@/constants/config";
import { getAccessToken } from "@/api/storage";

class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const getAuthHeaders = () => {
  const accessToken = getAccessToken();

  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`;
};

const parseJson = async (response) => {
  return response.json().catch(() => null);
};

const createApiError = (fallbackMessage, response, data) => {
  return new ApiError(data?.message || fallbackMessage, {
    status: response.status,
    data,
  });
};

export const request = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new ApiError("서버에 연결할 수 없습니다.", {
      data: error,
    });
  }

  const data = await parseJson(response);

  if (!response.ok) {
    throw createApiError("요청 처리 중 오류가 발생했습니다.", response, data);
  }

  return data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  let response;

  try {
    response = await fetch(`${API_BASE_URL}/images`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
  } catch (error) {
    throw new ApiError("서버에 연결할 수 없습니다.", {
      data: error,
    });
  }

  const data = await parseJson(response);

  if (!response.ok) {
    throw createApiError("이미지 업로드 중 오류가 발생했습니다.", response, data);
  }

  return data;
};
