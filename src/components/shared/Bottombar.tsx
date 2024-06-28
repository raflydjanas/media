import { bottombarLinks } from "@/constans";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar px-4">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link to={link.route} key={link.label} className={`${isActive && "bg-primary-500 rounded-[10px]"} flex-center flex-col gap-1 p-2`}>
            <img src={link.imgURL} alt={link.label} className={`${isActive && "invert-white"}`} width={20} height={20} />
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
