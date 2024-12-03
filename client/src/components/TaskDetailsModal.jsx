import React, { useState, useEffect, useContext } from "react";
import { GlobalData } from "../context";
import { LiaTimesSolid } from "react-icons/lia";

const TaskDetailsModal = ({ task, onClose, onUpdateStatus, onDelete }) => {
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [status, setStatus] = useState(task.status);
  const [error, setError] = useState(null);
  const { activeUser } = useContext(GlobalData);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(null); // State for countdown

  const confirmDelete = () => {
    setIsDeleting(true);
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

  useEffect(() => {
    setSubtasks(task.subtasks);
    setStatus(task.status);

    const calculateTimeRemaining = () => {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const timeRemaining = dueDate - now;

      if (timeRemaining <= 0) {
        clearInterval(intervalId);
        setCountdown("Time's up!");
      } else {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    const intervalId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [task.dueDate]);

  const canMoveToDoing = subtasks.some((subtask) => subtask.completed);
  const canMoveToDone = subtasks.every((subtask) => subtask.completed);

  const handleSubtaskToggle = async (index) => {
    const updatedSubtasks = subtasks.map((subtask, i) =>
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setSubtasks(updatedSubtasks);

    // Determine the updated status
    let newStatus = "todo";
    if (updatedSubtasks.every((subtask) => subtask.completed)) {
      newStatus = "done";
    } else if (updatedSubtasks.some((subtask) => subtask.completed)) {
      newStatus = "doing";
    }

    try {
      const response = await fetch(
        `/api/task/tasks/update-status/${task._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            subtasks: updatedSubtasks,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      const updatedTask = await response.json();
      onUpdateStatus(task._id, updatedTask.status, updatedTask.subtasks);
      setStatus(updatedTask.status); // Update the local status with the server response
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (newStatus === "doing" && !canMoveToDoing) {
      setError("You must complete at least one subtask to move to 'Doing'.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (newStatus === "done" && !canMoveToDone) {
      setError("all subtasks must be completed to move to 'Done'.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setStatus(newStatus);

    try {
      const response = await fetch(
        `/api/task/tasks/update-status/${task._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            subtasks: subtasks,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      const updatedTask = await response.json();
      onUpdateStatus(task._id, updatedTask.status, updatedTask.subtasks);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/task/delete-tasks/${task._id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.message || "Something went wrong");
      setTimeout(() => setError(null), 3000);
      return;
    }

    onDelete(task._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#2B2C37] p-6 rounded-lg w-3/4 md:w-1/2 lg:w-1/3">
        <LiaTimesSolid
          size={30}
          onClick={onClose}
          className="text-white float-right"
        />

        <h2 className="text-xl mb-4 font-bold text-white">{task.title}</h2>
        <p className="text-gray-300 mb-4">{task.description}</p>
        <div className="mb-4">
          <h3 className="text-white text-lg font-semibold">Subtask</h3>
          <ul>
            {subtasks.map((subtask, index) => (
              <li
                key={index}
                className={`text-gray-300 flex items-center gap-2 bg-[#0e122b] p-1 mb-2 rounded-md ${
                  subtask.completed ? "line-through" : ""
                }`}
              >
                {activeUser.isTeamMember && (
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={subtask.completed} // Bound to the 'completed' state of each subtask
                    onChange={() => handleSubtaskToggle(index)} // Toggles the 'completed' status
                  />
                )}
                {subtask.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-white text-lg font-semibold">Status</h3>
          <select
            value={status}
            onChange={handleStatusChange}
            className="bg-[#1E1F28] text-white px-4 py-2 rounded-md w-full"
          >
            <option value="todo">Todo</option>
            {activeUser.isTeamMember && <option value="done">Done</option>}
          </select>
        </div>
        <div className="mb-4">
          <h3 className="text-white text-lg font-semibold">Time Remaining</h3>
          <p className="text-gray-300">{countdown}</p>
        </div>

        {activeUser.isAdmin && (
          <button
            onClick={confirmDelete}
            className="text-white bg-red-600 p-2 rounded-md capitalize w-full"
          >
            Delete
          </button>
        )}

        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Are you sure you want to delete this task?
              </h2>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white py-2 px-4 rounded-md"
                >
                  Yes
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-600 bg-red-200 p-2 rounded-md">{error}</p>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
