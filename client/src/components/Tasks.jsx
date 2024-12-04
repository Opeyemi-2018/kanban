import React, { useContext, useEffect, useState } from "react";
import TaskDetailsModal from "./TaskDetailsModal";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlinePending } from "react-icons/md";
import { GlobalData } from "../context";

const Tasks = ({ tasks = [], loading, setTasks }) => {
  const { activeUser } = useContext(GlobalData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const handleTaskClick = (task) => {
    if (activeUser.isAdmin || task.assignedTo === activeUser.email) {
      setSelectedTask(task);
    } else {
      setError("You are not authorized to view this task.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const closeModal = () => {
    setSelectedTask(null);
  };
  const handleUpdateStatus = (taskId, newStatus, subtasks) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, status: newStatus, subtasks } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task._id !== taskId);
    setTasks(updatedTasks);
  };

  useEffect(() => {
    const storedFilter = localStorage.getItem("taskStatusFilter");
    if (storedFilter) {
      setStatusFilter(storedFilter);
    }
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "") return true; // Show all tasks
    return task.status === statusFilter;
  });

  const isTaskOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate !== null;
  };

  return (
    <div>
      {tasks.length > 0 && (
        <div className="flex space-x-4 mb-4 items-center mt-4">
          <h1>filtered by: </h1>
          <button
            onClick={() => setStatusFilter("todo")}
            className="px-4 py-1 bg-gray-300 text-red-600 rounded"
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("done")}
            className="px-4 py-1 bg-gray-300 text-green-500 rounded"
          >
            Done
          </button>
          <button
            onClick={() => setStatusFilter("")}
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded"
          >
            All
          </button>
        </div>
      )}
      {loading ? (
        <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div className="flex flex-col min-h-screen items-center justify-center flex-grow">
            <div className="h-8 w-8 rounded-full animate-ping bg-[#2B2C37]"></div>
          </div>
        </div>
      ) : filteredTasks.length > 0 ? (
        filteredTasks.map((task) => {
          const overdue = isTaskOverdue(task.dueDate);
          const taskBgClass =
            task.status === "done"
              ? "bg-[#2B2C37]" // No change when done
              : overdue
              ? "bg-red-600 animate-pulse" // Red fading effect when overdue
              : "bg-[#2B2C37]"; // Default background

          return (
            <div
              onClick={() => handleTaskClick(task)}
              key={task._id}
              className={`py-3 px-5 flex justify-between cursor-pointer rounded-md text-white my-3 ${taskBgClass}`}
            >
              <div className="flex items-center gap-10">
                <div>
                  {task.status === "done" ? (
                    <span className="text-green bg-green-500 rounded-full p-1 inline-block mr-2">
                      <MdOutlineDone size={25} />
                    </span>
                  ) : (
                    <span className="text-green bg-red-500 rounded-full p-1 inline-block mr-2">
                      <MdOutlinePending size={25} />
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="font-semibold ">{task.title}</h1>
                  <p className="text-gray-300">
                    {task.subtasks.length} subtasks
                  </p>
                </div>
              </div>{" "}
              <div className="flex flex-col">
                {task.assignedTo ? (
                  <div className="text-gray-300">
                    {task.status === "done" ? (
                      <p className="text-white flex flex-col">
                        Done by{" "}
                        <span className="text-gray-300  text-[18px]">
                          {task.assignedTo.substring(0, 10)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-white flex flex-col">
                        <span className="text-[17px]">Assigned to </span>
                        <span className="text-gray-300  text-[17px]">
                          {task.assignedTo.substring(0, 10)}
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-300">No assignee</p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <p className="font-bold text-3xl capitalize"> no task</p>
        </div>
      )}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onUpdateStatus={handleUpdateStatus}
          onClose={closeModal}
          onDelete={handleDeleteTask}
        />
      )}
      {error && (
        <div className="text-red-500 bg-red-100 py-2 px-4 rounded-md fixed  transform -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2">
          <p className="text-center">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
