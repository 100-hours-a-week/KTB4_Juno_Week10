import CommentItem from "@/features/posts/CommentItem";
import { isOwner } from "@/utils/auth";

const CommentList = ({ comments, currentUserId, onDelete, onEdit }) => {
  if (!comments.length) {
    return (
      <p className="mt-1 rounded-[22px] border border-[#dedede] bg-white p-6 text-center text-sm text-[#5f5e5e]">
        아직 댓글이 없습니다.
      </p>
    );
  }

  return (
    <div className="mt-0 flex w-full flex-col gap-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={isOwner(comment.authorId, currentUserId)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
