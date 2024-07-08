import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showTags?: boolean;
};
const GridPostList = ({ posts, showTags = true, showUser = true }: GridPostListProps) => {
  const { user } = useUserContext();
  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`}>
            <img src={post.imageUrl} alt="post" className="h-full w-full object-cover rounded-b-[24px]" />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1 ">
                <img src={post?.creator?.imageUrl} alt="creator" className="h-8 w-8 rounded-full" />
                <p className="line-clamp-1">{post?.creator?.name}</p>
              </div>
            )}

            {showTags && <PostStats post={post} userId={user?.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
