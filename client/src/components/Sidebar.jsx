import { useEffect, useState } from "react";
import Frontend from "./Frontend";
import Backend from "./Backend";
import Design from "./Design";
import SignUp from "../pages/SignUp";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleTabClick = (selectedTab) => {
    setTab(selectedTab);
    const newUrl = `${location.pathname}?tab=${selectedTab}`;
    window.history.pushState({}, "", newUrl); // Update URL without reloading
  };
  return (
    <main>
      <div className="flex  gap-6 pt-16">
        <div className="bg-[#2B2C37] w-64 h-screen ">
          <div className="flex flex-col gap-3 p-5 text-1xl text-gray-400">
            <h1 className="p-2">All board</h1>
            <h1
              className={`p-2 rounded-md ${
                tab === "backend"
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 hover:text-white"
              } transition-all ease-in-out duration-300`}
              onClick={() => handleTabClick("backend")}
            >
              Backend Task
            </h1>
            <h1
              className={`p-2 rounded-md ${
                tab === "frontend"
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 hover:text-white"
              } transition-all ease-in-out duration-300`}
              onClick={() => handleTabClick("frontend")}
            >
              Frontend Task
            </h1>
            <h1
              className={`p-2 rounded-md ${
                tab === "design"
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 hover:text-white"
              } transition-all ease-in-out duration-300`}
              onClick={() => handleTabClick("design")}
            >
              UI/UX Task
            </h1>
            <Link
              to={"/sign-up"}
              className={`p-2 rounded-md ${
                tab === "signin"
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-600 hover:text-white"
              } transition-all ease-in-out duration-300`}
            >
              Sign Up
            </Link>
          </div>
        </div>
        <div className="p-5 flex-1">
          {tab === "frontend" && <Frontend />}
          {tab === "backend" && <Backend />}
        </div>
      </div>
    </main>
  );
};

export default Sidebar;

// 1e1e2c
