import React, { useState, useEffect } from "react";
import {
  Outlet,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { BookOpen, User, LogOut, Menu, X } from "lucide-react";

function MainLayout() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user; // Convert user object to boolean
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  useEffect(() => {
    // If user is NOT logged in and trying to access a protected route, redirect them
    if (!isAuthenticated && location.pathname.startsWith("/dashboard")) {
      navigate("/");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <div
      className={`${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen flex flex-col`}
    >
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">AI Learning Platform</span>
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/courses"
              className="hover:text-indigo-200 transition-colors"
            >
              Courses
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-indigo-200 transition-colors"
                >
                  Dashboard
                </Link>
                {user?.role === "teacher" && (
                  <Link
                    to="/teacher"
                    className="hover:text-indigo-200 transition-colors"
                  >
                    Teacher Portal
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hover:text-indigo-200 transition-colors"
                  >
                    Admin Portal
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center space-x-1 hover:text-indigo-200 transition-colors"
                  >
                    <User size={18} />
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 hover:text-indigo-200 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-indigo-700 px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/courses"
                className="hover:text-indigo-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hover:text-indigo-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {user?.role === "teacher" && (
                    <Link
                      to="/teacher"
                      className="hover:text-indigo-200 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Teacher Portal
                    </Link>
                  )}

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="hover:text-indigo-200 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Portal
                    </Link>
                  )}

                  <Link
                    to="/dashboard/profile"
                    className="hover:text-indigo-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left hover:text-indigo-200 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="hover:text-indigo-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="hover:text-indigo-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold">About Us</h3>
              <p className="mt-2 text-sm">
                AI Learning Platform provides high-quality courses to enhance
                your skills and knowledge.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-300">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-300">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-300">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <div className="flex justify-center md:justify-start space-x-4 mt-2">
                <a href="#" className="hover:text-indigo-300">
                  Facebook
                </a>
                <a href="#" className="hover:text-indigo-300">
                  Twitter
                </a>
                <a href="#" className="hover:text-indigo-300">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <p className="text-center text-sm mt-6">
            &copy; {new Date().getFullYear()} AI Learning Platform. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
