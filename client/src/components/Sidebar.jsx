import { useContext, useEffect, useState } from "react";
import { PiSignOutThin } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { GlobalData } from "../context";
import { FaPlus } from "react-icons/fa6";
import Task from "./Tasks";
import Users from "./Users";

const Sidebar = () => {
  const { activeUser, signOutUser } = useContext(GlobalData);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === "all" ? null : category);
  };

  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.category === selectedCategory)
    : tasks;
  const uniqueCategories = Array.from(
    new Set(tasks.map((task) => task.category))
  );
  return (
    <main>
      <div className="flex  gap-6 pt-16">
        <div className="bg-[#2B2C37] w-64 h-screen ">
          <div className=" flex flex-col gap-3 p-5 text-1xl text-gray-400">
            <div className="border-b-2 border-gray-500">
              <button
                onClick={() => handleCategoryClick("all")}
                className="py-2 flex items-center gap-2"
              >
                All board
              </button>
              {uniqueCategories.map((category) => (
                <div key={category} className="px-3 py-1">
                  <button onClick={() => handleCategoryClick(category)}>
                    {category}
                  </button>
                </div>
              ))}
            </div>
            {activeUser && activeUser.isAdmin && (
              <Link
                to={"/create-task"}
                className="text-white justify-center  bg-purple-700 flex items-center gap-2 px-3 py-2 rounded-full"
              >
                <span>
                  <FaPlus />
                </span>{" "}
                add task
              </Link>
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
        <div className="w-[600px] pt-10">
          <Task tasks={filteredTasks} loading={loading} />
        </div>
        <div className="pt-10 w-[400px]">
          <Users />
        </div>
      </div>
    </main>
  );
};

export default Sidebar;

// 1e1e2c
