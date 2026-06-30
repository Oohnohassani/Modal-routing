import Comment from "./Comment";

function Comments({ comments }) {
  return (
    <div className="flex w-full flex-col items-center justify-start px-3 py-2">
      {comments.map((comment, index) => (
        <Comment
          key={comment.id}
          comment={comment}
          isLast={index === comments.length - 1}
        />
      ))}
    </div>
  );
}

export default Comments;
