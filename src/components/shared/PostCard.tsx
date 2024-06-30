import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  console.log("🚀 ~ PostCard ~ post:", post);

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img src={post?.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="profile" className="w-12 lg:h-12 rounded-full object-cover" />
          </Link>

          <div className="flex flex-col">
            <p>{post?.creator?.name}</p>
            <div className="flex-center gap-2 text-light-2">
              <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.createdAt as string)}</p>-
              <p className="subtle-semibold lg:small-regular">{post?.location ? post?.location : "location secret"}</p>
            </div>
          </div>
        </div>

        <Link to={`/update-post/${post.$id}`} className={`${user?.id !== post?.creator?.$id ? "hidden" : "block"}`}>
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post?.$id}`}>
        <div className="">
          <p className="text-light-2">{post?.caption}</p>
          <ul className="flex gap-1 my-2">
            {post.tags?.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img src={post.imageUrl || "/assets/images/profile-placeholder.svg"} alt="post-result" className="post-card_img" />
      </Link>

      <PostStats />
    </div>
  );
};

export default PostCard;
