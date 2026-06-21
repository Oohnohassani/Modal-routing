import { LuBadgeCheck, LuHeart } from "react-icons/lu";

function Comment({ comment }) {
  const { username, userImg, comment: text, createdAt, verified } = comment;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="w-full">
          {/* Profile */}
          <div className="flex items-center justify-start gap-2">
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
              <img draggable="false" src={userImg} alt="" />
            </div>

            <div className="flex items-center justify-start gap-1">
              <h4 className="text-xs font-semibold text-gray-700">
                {username}
              </h4>

              {verified && (
                <span>
                  <LuBadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
                </span>
              )}

              <p className="mt-0.5 text-[11px] text-gray-500">{createdAt}</p>
            </div>
          </div>

          {/* comment content */}
          <div className="ml-3 border-l border-gray-200 pl-5">
            <p className="mb-2 text-xs text-gray-600">{text}</p>
          </div>
        </div>

        {/* Like comment heart */}
        <div>
          <LuHeart className="cursor-pointer text-sm text-gray-600" />
        </div>
      </div>
    </div>
  );
}

export default Comment;
