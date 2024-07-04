import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavedPost } from "@/lib/react-query/querisAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "../ui/Loader";

type postStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: postStatsProps) => {
  const postLiked = post?.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(postLiked);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSevingPost } = useSavedPost();
  const { mutate: deleteSavePost, isPending: isDeletingSaved } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save?.find((record: Models.Document) => record?.post?.$id === post?.$id);

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser, savedPostRecord]);

  const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((id) => id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post?.$id || "", likesArray });
  };

  const handleSaved = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userId: userId, postId: post?.$id || "" });
    setIsSaved(true);
  };

  return (
    <div className="flex justify-between items-center z-20 mt-3">
      <div className="flex gap-2 mr-5">
        <img src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"} alt="" className="cursor-pointer" onClick={handleLikePost} width={20} height={20} />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSevingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"} alt="" className="cursor-pointer" onClick={(e) => handleSaved(e)} width={20} height={20} />
        )}
      </div>
    </div>
  );
};

export default PostStats;
