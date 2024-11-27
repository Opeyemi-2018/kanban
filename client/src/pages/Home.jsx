import { Link } from "react-router-dom";
import { LuKanban } from "react-icons/lu";
import { useState } from "react";

const Home = () => {
  const [loading, setLoading] = useState(true);
  setTimeout(() => setLoading(false), 3000);
  return (
    <div className="h-screen bg-[#2B2C37]">
      {loading ? (
        <div className="flex flex-col min-h-screen items-center justify-center flex-grow">
          <div className="h-8 w-8 rounded-full animate-ping bg-white"></div>
        </div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto pt-20">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-white  animate__animated animate__fadeIn animate__delay-1s">
              <span>
                <LuKanban
                  size={30}
                  className="text-purple-600 animate__animated animate__bounce animate__infinite"
                />
              </span>{" "}
              Kanban{" "}
            </h1>
          </div>

          <section className=" flex flex-col gap-5 items-center justify-center text-center px-6 pt-20 text-white animate__animated animate__fadeIn animate__delay-1s">
            <h1 className="text-2xl">Organize your work with ease </h1>
            <p className="text-3xl">
              streamline your task and improve productivity with kanban board
            </p>
            <Link
              to={"/sign-up"}
              className="bg-purple-600 p-3 rounded-full transform transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-lg hover:bg-purple-700"
            >
              Get Started
            </Link>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
