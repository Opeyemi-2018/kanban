import { useContext, useEffect, useState } from "react";
import Frontend from "./Frontend";
import Backend from "./Backend";
import Design from "./Design";
import { PiSignOutThin } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { GlobalData } from "../context";
import { IoIosArrowUp } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";

const Sidebar = () => {
  const { activeUser, signOutUser } = useContext(GlobalData);
  const navigate = useNavigate();
  const [dropDown, setDropDown] = useState(false);
  const [tab, setTab] = useState("");
  const [error, setError] = useState(null);

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

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "something went wrong");
      }
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      navigate("/");
      signOutUser();
    } catch (error) {}
  };
  return (
    <main>
      <div className="flex  gap-6 pt-16">
        <div className="bg-[#2B2C37] w-64 h-screen ">
          <div className=" flex flex-col gap-3 p-5 text-1xl text-gray-400">
            <div className="border-b-2 border-gray-500">
              <h1
                onClick={() => setDropDown(!dropDown)}
                className="p-2 flex items-center gap-2"
              >
                All board{" "}
                <IoIosArrowUp
                  size={25}
                  className={`${
                    dropDown ? "rotate-0" : "rotate-180"
                  }  duration-300`}
                />
              </h1>
              {dropDown && (
                <div className="pl-2 pb-1 flex flex-col gap-2">
                  <h1
                    className={`p-1 rounded-md ${
                      tab === "backend"
                        ? "bg-purple-600 text-white"
                        : "hover:bg-purple-600 hover:text-white"
                    } transition-all ease-in-out duration-300`}
                    onClick={() => handleTabClick("backend")}
                  >
                    Backend Task
                  </h1>
                  <h1
                    className={`p-1 rounded-md ${
                      tab === "frontend"
                        ? "bg-purple-600 text-white"
                        : "hover:bg-purple-600 hover:text-white"
                    } transition-all ease-in-out duration-300`}
                    onClick={() => handleTabClick("frontend")}
                  >
                    Frontend Task
                  </h1>
                  <h1
                    className={`p-1 rounded-md ${
                      tab === "design"
                        ? "bg-purple-600 text-white"
                        : "hover:bg-purple-600 hover:text-white"
                    } transition-all ease-in-out duration-300`}
                    onClick={() => handleTabClick("design")}
                  >
                    UI/UX Task
                  </h1>
                </div>
              )}
            </div>
            <button className="text-white justify-center  bg-purple-700 flex items-center gap-2 px-3 py-2 rounded-full">
              <span>
                <FaPlus />
              </span>{" "}
              add task
            </button>
            {/* <h1 className="border-b-2 border-gray-500">
              {activeUser ? (
                <div>Welcome {activeUser.name}</div>
              ) : (
                <Link
                  to={"/sign-up"}
                  className={`p-2 rounded-md  ${
                    tab === "signin"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-purple-600 hover:text-white"
                  } transition-all ease-in-out duration-300`}
                >
                  Sign Up
                </Link>
              )}
            </h1> */}
            <button
              onClick={handleSignOut}
              className="bg-gray-600 flex items-center justify-center gap-4 text-white rounded-md p-2 mt-40"
            >
              <span>
                <PiSignOutThin size={20} />
              </span>{" "}
              sign out{" "}
            </button>
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
