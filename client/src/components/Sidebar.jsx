import { useContext, useEffect, useState } from "react";
import Frontend from "./Frontend";
import Backend from "./Backend";
import Design from "./Design";
import { PiSignOutThin } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { GlobalData } from "../context";
import { IoIosArrowUp } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import CreateTask from "./CreateTask";
import { Task } from "../../../server/models/taskModel";

const Sidebar = () => {
  const { activeUser, signOutUser } = useContext(GlobalData);
  const navigate = useNavigate();
  const [dropDown, setDropDown] = useState(false);
  const [tab, setTab] = useState("");
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  console.log(tasks);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/task/tasks");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData || "something went wrong");
        }
        const data = await res.json();
        console.log(data);

        setTasks(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

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
              <h1 className="py-2 flex items-center gap-2">All board</h1>
              {tasks.map((task) => {
                const { category } = task;
                return (
                  <div key={task._id} className="px-3 py-1">
                    <button> {category}</button>
                  </div>
                );
              })}
            </div>
            {activeUser && activeUser.isAdmin && (
              <button
                onClick={() => handleTabClick("create-task")}
                className="text-white justify-center  bg-purple-700 flex items-center gap-2 px-3 py-2 rounded-full"
              >
                <span>
                  <FaPlus />
                </span>{" "}
                add task
              </button>
            )}
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
          {/* {tab === "frontend" && <Frontend />}
          {tab === "backend" && <Backend />} */}

          {tab === "create-task" && <CreateTask />}
          {tab === "tasks" && <Task />}
        </div>
      </div>
    </main>
  );
};

export default Sidebar;

// 1e1e2c
