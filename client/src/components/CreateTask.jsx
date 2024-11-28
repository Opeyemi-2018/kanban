import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LiaTimesSolid } from "react-icons/lia";
import { MdErrorOutline } from "react-icons/md";

const CreateTask = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    title: "",
    assignedTo: "",
    subtasks: [""],
    category: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = [...formData.subtasks];
    updatedSubtasks[index] = value;
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const addSubtask = () => {
    setFormData({ ...formData, subtasks: [...formData.subtasks, ""] });
  };

  const removeSubtask = (index) => {
    const updatedSubtasks = formData.subtasks.filter((_, i) => i !== index);
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { description, title, assignedTo, category, subtasks } = formData;
    if (!description || !title || !assignedTo || !category) {
      setError("all fields are required");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!subtasks.every((subtask) => subtask.trim())) {
      setError("Subtasks cannot be empty.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/task/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "something went wrong");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto pt-10 px-3">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="enter task name"
            required
            className="w-full border p-2 rounded mb-4 focus:outline-none"
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            id="description"
            placeholder="enter task description"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4 focus:outline-none"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2">Subtasks</label>
          {formData.subtasks.map((subtask, index) => (
            <div
              key={index}
              className="flex items-center gap-2 mb-2
            "
            >
              <input
                type="text"
                value={subtask}
                onChange={(e) => handleSubtaskChange(index, e.target.value)}
                className="w-full border p-2 rounded focus:outline-none"
              />{" "}
              <button
                type="button"
                onClick={() => removeSubtask(index)}
                className="text-red-500"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSubtask}
            className="bg-gray-600 text-white py-1 px-2 mb-2 rounded-md "
          >
            + Add Subtask
          </button>
        </div>
        <input
          type="text"
          id="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4 focus:outline-none"
        />
        <input
          type="email"
          id="assignedTo"
          placeholder="Assignee Email"
          value={formData.assignedTo}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4 focus:outline-none"
          required
        />
        <div className="flex justify-end gap-4">
          <button
            disabled={loading}
            type="submit"
            className="px-4 py-2 bg-purple-700 text-white rounded"
          >
            {loading ? "creating ...." : "Create task"}
          </button>
        </div>
      </form>
      {error && (
        <div className="flex items-center gap-8 text-nowrap text-[15px] bg-red-100 text-red-600 rounded-md px-5 py-2">
          <span className="flex items-center gap-2">
            <MdErrorOutline size={20} /> {error}
          </span>
          <div>
            <LiaTimesSolid
              size={20}
              onClick={() => setError(null)}
              className="  cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;