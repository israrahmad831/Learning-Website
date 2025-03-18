import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(
          "Auth check failed:",
          err.response?.data?.message || err.message
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔑 Check if user is authenticated
  const isAuthenticated = !!user;

  // 📝 Register Function
  const register = async (name, email, password, role = "student") => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      // Check if the account requires admin approval
      if (response.data.isApproved === false) {
        return {
          success: true,
          message: "Account created but pending admin approval.",
        };
      }

      // Automatically log in only if approved
      await login(email, password);
      return {
        success: true,
        message: "Registration successful! You are now logged in.",
      };
    } catch (err) {
      console.error(
        "Registration failed:",
        err.response?.data?.message || err.message
      );
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // 🔐 Login Function
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token); // ✅ Store token in localStorage
      setUser(res.data.user);

      // Redirect based on role
      switch (res.data.user.role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "teacher":
          navigate("/teacher", { replace: true });
          break;
        case "student":
          navigate("/dashboard", { replace: true });
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // 🚪 Logout Function
  const logout = () => {
    localStorage.removeItem("token"); // ❌ Remove token
    setUser(null);
    navigate("/", { replace: true }); // Ensure redirection
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, register, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
