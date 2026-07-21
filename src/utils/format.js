export const formatCount = (count) => {
  const safeCount = Number(count ?? 0);

  if (safeCount >= 1000) {
    return `${Math.floor(safeCount / 1000)}k`;
  }

  return String(safeCount);
};
