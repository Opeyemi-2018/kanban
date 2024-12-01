import React, { useContext, useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GlobalData } from "../context";

const Users = () => {
  const { activeUser } = useContext(GlobalData);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/get-users");
        if (!res.ok) {
          const errrorData = await res.json();
          throw new Error(errrorData.message || "something went wrong");
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

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`/api/user/delete-user/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || "something went wrong");
      }
      const data = await res.json();
      setUsers(users.filter((user) => user._id !== userId));
      setShowWarning(false);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleCancel = () => {
    setShowWarning(false);
    setUserToDelete(null);
  };
  return (
    <div className=" bg-gray-100 p-6">
      <h1 className="text-2xl text-gray-700 capitalize font-bold">
        team member
      </h1>
      {users.length > 0 ? (
        <div className="flex flex-col">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white mb-3 p-4 rounded-lg flex items-center justify-between shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h2>
              {user.isAdmin ? (
                <p className=" rounded-md p-1 text-green-500 font-semibold">
                  Admin
                </p>
              ) : (
                <p className="text-gray-600 rounded-md p-1 font-semibold">
                  Member
                </p>
              )}
              {showWarning && userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Are you sure you want to delete {userToDelete.name}?
                    </h2>
                    <div className="flex justify-around">
                      <button
                        onClick={() => handleDelete(userToDelete._id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-md"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeUser.isAdmin && (
                <button
                  onClick={() => {
                    setUserToDelete(user);
                    setShowWarning(true);
                  }}
                >
                  <RiDeleteBin6Line size={25} className="text-red-600" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default Users;
