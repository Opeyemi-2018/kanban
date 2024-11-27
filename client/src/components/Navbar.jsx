import { FaPlus } from "react-icons/fa6";

import { LuKanban } from "react-icons/lu";
import { Link } from "react-router-dom";
const Navbar = () => {
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
        <button className="text-white bg-purple-700 flex items-center gap-1 px-3 py-2 rounded-full">
          <span>
            <FaPlus />
          </span>{" "}
          add task
        </button>
      </div>
    </div>
  );
};

export default Navbar;
