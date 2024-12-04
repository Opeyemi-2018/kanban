import React, { useContext, useEffect, useState } from "react";
import { GlobalData } from "../context";

const Users = () => {
  const { activeUser } = useContext(GlobalData);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/get-users");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Something went wrong");
        }
        const data = await res.json();
        setUsers(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/user/delete-user/${selectedUser._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setShowDeleteWarning(false);
      setSelectedUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const closePopup = () => {
    setSelectedUser(null);
    setShowDeleteWarning(false);
  };

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-2xl text-gray-700 capitalize font-bold">
        Team Members
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="h-8 w-8 rounded-full animate-ping bg-[#2B2C37]"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : users.length > 0 ? (
        <div className="">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white flex items-center justify-between p-2 mb-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h2>

              {activeUser.isAdmin && (
                <button
                  onClick={() => setSelectedUser(user)}
                  className="mt-2 text-blue-600"
                >
                  View Info
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No users found.</p>
      )}

      {/* User Info Popup */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-zoomIn">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ❌
            </button>
            <img
              src={selectedUser.image || "/default-avatar.png"}
              alt={selectedUser.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-200"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-6">
                <p className="text-[18px]">name</p>
                <h2 className="text-xl font-semibold text-gray-500 mb-2 text-center">
                  {selectedUser.name}
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-[18px]">Role</p>
                <p className="text-gray-700 text-center">
                  Role: {selectedUser.isAdmin ? "Admin" : "Member"}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-[18px]">email: </p>
                <h2 className="text-lg  text-gray-500">{selectedUser.email}</h2>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-700">
                Tasks Completed: {selectedUser.taskCountCompleted || 0}
              </p>
              <p className="text-gray-700">
                Tasks Remaining: {selectedUser.taskCountUndone || 0}
              </p>
            </div>
            {activeUser.isAdmin && (
              <button
                onClick={() => setShowDeleteWarning(true)}
                className="bg-red-600 text-white py-2 px-4 rounded-md mt-4 w-full"
              >
                Delete User
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Are you sure you want to delete {selectedUser.name}?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteWarning(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
