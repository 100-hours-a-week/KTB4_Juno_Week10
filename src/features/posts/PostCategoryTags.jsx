const PostCategoryTags = ({ categories = [], className = "" }) => {
  if (!categories.length) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <span
          key={category.id}
          className="rounded-full bg-[#fff1ed] px-2.5 py-1 text-xs font-semibold leading-4 text-[#9c2600]"
        >
          # {category.name}
        </span>
      ))}
    </div>
  );
};

export default PostCategoryTags;
