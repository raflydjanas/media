import GridPostList from "@/components/shared/GridPostList";
import SearchResult from "@/components/shared/SearchResult";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import useDebounce from "@/hooks/useDebounce";
import { useGetPost, useSearchPosts } from "@/lib/react-query/querisAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const { inView } = useInView();

  const { data: posts, fetchNextPage } = useGetPost();

  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debounceValue);

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResult = searchValue !== "";
  const shuldShowPosts = !shouldShowSearchResult && posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Post</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" alt="search" width={24} height={24} />
          <Input type="text" placeholder="Search Post" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="explore-search " />
        </div>
      </div>

      <div className="flex-between w-full max-w5xl mt-16 mb-7">
        <h2 className="body-bold md:h3-bold">Popular Today</h2>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResult ? (
          <SearchResult isSearchFetching={isSearchFetching} searchedPosts={searchedPosts} />
        ) : shuldShowPosts ? (
          <p>End of Posts</p>
        ) : (
          posts?.pages.map((item, i) => <GridPostList key={`page-${i}`} posts={item.documents} />)
        )}
      </div>
    </div>
  );
};

export default Explore;
