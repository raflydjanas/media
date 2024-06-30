const PostStats = () => {
  return (
    <div className="flex justify-between items-center z-20 mt-3">
      <div className="flex gap-2 mr-5">
        <img src="/assets/icons/like.svg" alt="" className="cursor-pointer" width={20} height={20} />
        <p className="small-medium lg:base-medium">0</p>
      </div>

      <div className="flex gap-2">
        <img src="/assets/icons/save.svg" alt="" className="cursor-pointer" width={20} height={20} />
      </div>
    </div>
  );
};

export default PostStats;
