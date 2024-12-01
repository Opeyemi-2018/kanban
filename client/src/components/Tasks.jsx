import React, { useContext, useState } from "react";
import TaskDetailsModal from "./TaskDetailsModal";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlinePending } from "react-icons/md";
import { GlobalData } from "../context";

const Tasks = ({ tasks = [], loading }) => {
  const { activeUser } = useContext(GlobalData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div>
      {loading ? (
        <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div className="flex flex-col min-h-screen items-center justify-center flex-grow">
            <div className="h-8 w-8 rounded-full animate-ping bg-[#2B2C37]"></div>
          </div>
        </div>
      ) : tasks.length > 0 ? (
        tasks.map((task) => {
          return (
            <div
              onClick={() => handleTaskClick(task)}
              key={task._id}
              className="bg-[#2B2C37] py-3 px-5 flex  justify-between cursor-pointer rounded-md text-white my-3 "
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
              </div>
              <div className="flex flex-col">
                {/* Handle assignedTo as a string */}
                {task.assignedTo ? (
                  <p className="text-gray-300">
                    {task.status === "done" ? (
                      <p className="text-white flex flex-col">
                        Done by{" "}
                        <span className="text-gray-300 font-semibold text-[22px]">
                          {task.assignedTo.substring(0, 10)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-white flex flex-col">
                        Assigned to{" "}
                        <span className="text-gray-300 font-semibold text-[22px]">
                          {task.assignedTo.substring(0, 10)}
                        </span>
                      </p>
                    )}
                  </p>
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
          onclose={closeModal}
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
