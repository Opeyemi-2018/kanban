import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("yes");

    try {
      setLoading(true);
      if (!formData.email || !formData.password) {
        setError("all fields are require");
        setTimeout(() => setError(null), 3000);
        return;
      }
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "something went wrong");
      }
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        setTimeout(() => setError(null), 3000);
        return;
      }
      navigate("/dashboard");
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setFormData({ email: "", password: "" });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="pt-20 px-3 max-w-xl mx-auto">
      <button
        className="py-6 flex items-end gap-2 text-gray-600"
        onClick={handleGoBack}
      >
        <IoIosArrowBack size={25} /> Go back
      </button>
      <h1 className="font-semibold text-2xl text-center py-4">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          id="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-500 rounded-md p-2 w-full focus:outline-none"
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-500 rounded-md p-2 w-full focus:outline-none"
        />
        <button
          disabled={loading}
          className="bg-[#2B2C37] p-2 rounded-md w-full capitalize text-white"
        >
          {loading ? "Signing in" : "Sign in"}
        </button>
      </form>

      {/* error div */}
      {error && (
        <p className="flex items-center gap-8 text-nowrap text-[15px] bg-red-100 text-red-600 rounded-md p-2">
          <span className="flex items-center gap-2">
            <MdErrorOutline size={20} /> {error}
          </span>
          <LiaTimesSolid
            size={20}
            onClick={() => setError(null)}
            className="  cursor-pointer"
          />
        </p>
      )}
    </div>
  );
};

export default SignIn;
