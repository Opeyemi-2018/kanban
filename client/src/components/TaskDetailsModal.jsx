import React, { useState, useEffect, useContext } from "react";
import { GlobalData } from "../context";

const TaskDetailsModal = ({ task, onclose, onUpdateStatus }) => {
  console.log(task.status);

  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [status, setStatus] = useState(task.status);
  const [error, setError] = useState(null);
  const { activeUser } = useContext(GlobalData);
  useEffect(() => {
    setSubtasks(task.subtasks);
    setStatus(task.status);
  }, [task]);

  const canMoveToDoing = subtasks.some((subtask) => subtask.completed);
  const canMoveToDone = subtasks.every((subtask) => subtask.completed);

  const handleSubtaskToggle = (index) => {
    const updateSubtasks = subtasks.map((subtask, i) =>
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setSubtasks(updateSubtasks);
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    if (newStatus === "doing" && !canMoveToDoing) {
      setError("You must complete at least one subtask to move to 'Doing'.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (newStatus === "done" && !canMoveToDone) {
      setError("You must complete all subtasks to move to 'Done'.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setStatus(newStatus);
    onUpdateStatus(task.id, newStatus, subtasks); // Notify the parent component or backend
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#2B2C37] p-6 rounded-lg w-3/4 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl mb-4 font-bold text-white">{task.title}</h2>
        <p className="text-gray-400 mb-4">{task.description}</p>
        <div className="mb-4">
          <h3 className="text-white text-lg font-semibold">Subtask</h3>
          <ul>
            {subtasks.map((subtask, index) => (
              <li
                key={index}
                className={`text-gray-400 flex items-center gap-2 bg-[#0e122b] p-1 mb-2  rounded-md ${
                  subtask.completed ? "line-through" : ""
                }`}
              >
                {activeUser.isTeamMember && (
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={subtask.completed}
                    onChange={() => handleSubtaskToggle(index)}
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
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button
          onClick={onclose}
          className="mt-4 px-4 py-2 bg-purple-700 text-white rounded-md"
        >
          Close
        </button>
        {error && (
          <p className="text-red-600 bg-red-200 p-2 rounded-md">{error}</p>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
