import { Input } from "@/components/ui/input";

const Explore = () => {
  return (
    <div className="explore-container">
      <div className="explore-inner_container">Explore</div>
      <h2 className="h3-bold md:h2-bold w-ful">Search Post</h2>
      <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 mt-3">
        <img src="/assets/icons/search.svg" alt="search" width={24} height={24} />
        <Input type="text" placeholder="Search Post" className="explore-search " />
      </div>
    </div>
  );
};

export default Explore;
