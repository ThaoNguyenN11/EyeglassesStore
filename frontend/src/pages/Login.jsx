import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include credentials to handle cookies
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      await login(email, password);
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
