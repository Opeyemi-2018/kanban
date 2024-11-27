import { useContext } from "react";

import { LuKanban } from "react-icons/lu";
import { Link } from "react-router-dom";
import { GlobalData } from "../context";
const Navbar = () => {
  const { isActiveUser } = useContext(GlobalData);
  return (
    <div className="bg-[#2B2C37] w-full text-white fixed top-0 left-0 right-0 ">
      <div className="flex items-center justify-between p-4">
        <Link
          to={"/"}
          className="flex items-center gap-2 text-3xl font-bold text-white "
        >
          <span>
            <LuKanban size={30} className="text-purple-600" />
          </span>{" "}
          Kanban{" "}
        </Link>
        <h1 className="text-3xl">marketing</h1>

        {isActiveUser ? (
          <div>{isActiveUser.name}</div>
        ) : (
          <Link to={"/sign-in"}>Sign in</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
