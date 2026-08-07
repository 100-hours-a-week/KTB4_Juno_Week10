export const DEFAULT_CATEGORY_STYLE = {
  backgroundColor: "#fff1f1",
  color: "#b71422",
};

export const CATEGORY_STYLES = {
  "얼얼한 매운맛": {
    backgroundColor: "#ffe3df",
    color: "#d92323",
  },
  "달콤고소한 맛": {
    backgroundColor: "#f3dfc9",
    color: "#7a431d",
  },
  "새콤상큼한 맛": {
    backgroundColor: "#fff2b8",
    color: "#6f6b1f",
  },
  "짭짤한 간장 맛": {
    backgroundColor: "#7b4a28",
    color: "#ffffff",
  },
  "고소한 참깨 맛": {
    backgroundColor: "#ffd978",
    color: "#7a431d",
  },
  "연예인 추천 조합": {
    backgroundColor: "#a600b9",
    color: "#ffffff",
  },
};

export const getCategoryStyle = (categoryName) => {
  return CATEGORY_STYLES[categoryName] ?? DEFAULT_CATEGORY_STYLE;
};
