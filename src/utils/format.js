export const formatCount = (count) => {
  const safeCount = Number(count ?? 0);

  if (safeCount >= 1000) {
    return `${Math.floor(safeCount / 1000)}k`;
  }

  return String(safeCount);
};

const padDateUnit = (value) => String(value).padStart(2, "0");

export const formatCommentCreatedAt = (createdAt) => {
  if (!createdAt) {
    return "";
  }

  const createdDate = new Date(String(createdAt).replace(" ", "T"));
  const createdTime = createdDate.getTime();

  if (Number.isNaN(createdTime)) {
    return createdAt;
  }

  const diffMs = Date.now() - createdTime;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMs >= 0 && diffHours < 24) {
    if (diffMinutes < 1) {
      return "방금 전";
    }

    if (diffHours < 1) {
      return `${diffMinutes}분 전`;
    }

    return `${diffHours}시간 전`;
  }

  const year = createdDate.getFullYear();
  const month = padDateUnit(createdDate.getMonth() + 1);
  const date = padDateUnit(createdDate.getDate());

  return `${year}-${month}-${date}`;
};
