import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Kiểm tra đăng nhập khi mở trang
  useEffect(() => {
    const checkLogin = async () => {
      try {
        console.log("Checking login status...");
        const res = await axios.get("http://localhost:4000/api/user/profile", {
          withCredentials: true,
        });
        if (res.data.user) {
          console.log("User profile fetched successfully:", res.data.user);
          setUser(res.data.user);
        }
      } catch (error) {
        console.log("Failed to fetch user profile:", error);
        setUser(null);
      }
    };
    checkLogin();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/user/login",
        { email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log("Login successful:", res.data.user);
        setUser(res.data.user);
      } else {
        console.error("Login failed: ", res.data.message);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/user/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
