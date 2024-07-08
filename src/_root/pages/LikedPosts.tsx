import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/ui/Loader";
import { useGetCurrentUser } from "@/lib/react-query/querisAndMutations";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {currentUser?.liked?.length === 0 && <p>No liked posts</p>}
      <GridPostList posts={currentUser?.liked} showTags={false} />
    </>
  );
};

export default LikedPosts;
