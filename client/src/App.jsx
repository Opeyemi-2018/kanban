import { Routes, Route, BrowserRouter } from "react-router-dom";
import { GlobalContextProvider } from "./context";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import "animate.css";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
const App = () => {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-task" element={<CreateTask />} />
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  );
};

export default App;
