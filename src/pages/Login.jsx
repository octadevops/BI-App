import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/NLM LOGO.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getApiUrl, LOGIN_API } from "../api/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(getApiUrl(LOGIN_API), {
        UserName: username,
        Password: password,
      });

      // console.log("API response:", response.data);

      if (response.data.token && response.data.username) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        toast.success("Login successful");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 100);
      } else {
        console.error("Invalid response data:", response.data);
        throw new Error("Invalid response data");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed");
      setError("Invalid username or password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-500 p-5">
      <div className="bg-slate-900 px-8 py-14 rounded-xl shadow-lg w-full max-w-md text-white">
        <div className="flex justify-center items-center pb-6">
          <img src={Logo} alt="NLM Logo" className="w-[200px]" />
        </div>

        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 pb-2">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-400">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border rounded bg-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded bg-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-900 duration-300"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
