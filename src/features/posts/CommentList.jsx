import CommentItem from "@/features/posts/CommentItem";
import { isOwner } from "@/utils/auth";

const CommentList = ({ comments, currentUserId, onDelete, onEdit }) => {
  if (!comments.length) {
    return (
      <p className="mt-6 rounded-xl bg-white p-6 text-center text-sm text-[#5f5e5e]">
        아직 댓글이 없습니다.
      </p>
    );
  }

  return (
    <div className="mt-6 flex w-full flex-col gap-3">
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
