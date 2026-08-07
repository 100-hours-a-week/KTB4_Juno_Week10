import { getCategoryStyle } from "@/constants/categoryStyles";

const PostCategoryTags = ({ categories = [], className = "" }) => {
  if (!categories.length) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <span
          key={category.id}
          className="rounded-full px-2.5 py-1 text-xs font-semibold leading-4"
          style={getCategoryStyle(category.name)}
        >
          # {category.name}
        </span>
      ))}
    </div>
  );
};

export default PostCategoryTags;
