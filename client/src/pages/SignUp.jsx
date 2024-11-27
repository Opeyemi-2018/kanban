import React, { useState } from "react";
import useApi from "../api";
import { MdOutlineDone } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

import { LiaTimesSolid } from "react-icons/lia";
import { MdErrorOutline } from "react-icons/md";

const SignUp = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!formData.name || !formData.email || !formData.password) {
        setError("all fields are required");
        setTimeout(() => setError(null), 3000);
        return;
      }
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(erroData || "something went wrong");
      }
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setTimeout(() => setError(null), 3000);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
    setFormData({ name: "", email: "", password: "" });
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
      <h1 className="font-semibold text-2xl text-center py-4">Sign up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
        <input
          type="text"
          id="name"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
          className="border w-full border-gray-500 rounded-md p-2  focus:outline-none"
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          className="border w-full border-gray-500 rounded-md p-2 focus:outline-none"
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          className="border w-full border-gray-500 rounded-md p-2  focus:outline-none"
        />
        <button
          disabled={loading}
          className="bg-[#2B2C37] p-2 rounded-md capitalize text-white"
        >
          {loading ? "Signing Up" : "Sign Up"}
        </button>
      </form>
      <p className="text-[18px]">
        already have an accoung?{" "}
        <Link to={"/sign-in"} className="text-purple-600 ">
          sign in
        </Link>
      </p>

      {error && (
        <p className="flex items-center gap-8 text-nowrap text-[15px] bg-red-100 text-red-600 rounded-md px-5 py-2">
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
        </p>
      )}
    </div>
  );
};

export default SignUp;
