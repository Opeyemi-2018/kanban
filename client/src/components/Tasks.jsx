import React, { useState } from "react";
import TaskDetailsModal from "./TaskDetailsModal";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const Tasks = ({ tasks, loading }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };
  const handleUpdateStatus = (taskId, newStatus, subtasks) => {
    // Find the task by ID and update its status and subtasks
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus, subtasks } : task
    );
    // Update the tasks state
    // Assuming there's a function to update the tasks state, like setTasks
    // setTasks(updatedTasks);
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
        tasks.map((task, index) => {
          return (
            <div
              onClick={() => handleTaskClick(task)}
              key={index}
              className="bg-[#2B2C37] py-3 px-5  rounded-md text-white my-3 "
            >
              {task.status === "done" && (
                <IoCheckmarkDoneCircle className="text-green-500 inline-block mr-2" />
              )}
              <h1 className="font-semibold ">{task.title}</h1>
              <p className="text-gray-400">{task.subtasks.length} subtasks</p>
            </div>
          );
        })
      ) : (
        <p>no task</p>
      )}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onUpdateStatus={handleUpdateStatus}
          onclose={closeModal}
        />
      )}
    </div>
  );
};

export default Tasks;
