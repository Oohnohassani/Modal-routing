import Comment from "./Comment";

function Comments({ comments, isLoadingComments }) {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-4 px-3 py-2">
      {isLoadingComments
        ? "Loading..."
        : comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
    </div>
  );
}

export default Comments;
