import Icon from "@/components/common/Icon";
import { formatCount } from "@/utils/format";

const stats = [
  {
    key: "likeCount",
    icon: "favorite",
    filled: true,
  },
  {
    key: "commentCount",
    icon: "forum",
  },
  {
    key: "viewCount",
    icon: "visibility",
  },
];

const PostStats = ({ commentCount, likeCount, viewCount }) => {
  const values = {
    commentCount,
    likeCount,
    viewCount,
  };

  return (
    <div className="mt-auto flex items-center gap-4 pt-4">
      {stats.map((stat) => (
        <span
          key={stat.key}
          className="flex items-center gap-1 text-sm font-semibold leading-5 text-[#5f5e5e]"
        >
          <Icon className="text-xl" filled={stat.filled}>
            {stat.icon}
          </Icon>
          <span>{formatCount(values[stat.key])}</span>
        </span>
      ))}
    </div>
  );
};

export default PostStats;
