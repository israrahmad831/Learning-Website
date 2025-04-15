import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Outlet,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { BookOpen, User, LogOut, Menu, X } from "lucide-react";

function MainLayout() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user, logout } = useAuth();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!user; // Convert user object to boolean
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

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

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/feedback`);
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const handleReviewSubmit = async () => {
    if (!newComment.trim() || newRating === 0) {
      alert("Please enter a comment and rating before submitting.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newComment, rating: newRating }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Feedback submitted successfully!");
        setNewComment(""); // Clear input field
        setNewRating(0); // Reset rating
      } else {
        alert(data.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className={`${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen flex flex-col`}
    >
      <header className="text-white bg-indigo-600 shadow-md">
        <div className="container flex items-center justify-between px-4 py-3 mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold">AI Learning Platform</span>
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="items-center hidden space-x-6 md:flex">
            {user ? (
              <>
                {/* Common Dashboard Link for Students */}
                {user.role === "student" && (
                  <div className="space-x-6 md:flex">
                    <Link
                      to="/dashboard"
                      className="transition-colors hover:text-indigo-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/courses"
                      className="transition-colors hover:text-indigo-200"
                    >
                      Courses
                    </Link>
                  </div>
                )}

                {/* Teacher Portal Link */}
                {user.role === "teacher" && (
                  <Link
                    to="/teacher"
                    className="transition-colors hover:text-indigo-200"
                  >
                    Teacher Portal
                  </Link>
                )}

                {/* Admin Portal Link */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="transition-colors hover:text-indigo-200"
                  >
                    Admin Portal
                  </Link>
                )}

                {/* Profile and Logout */}
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center space-x-1 transition-colors hover:text-indigo-200"
                  >
                    <User size={18} />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 transition-colors hover:text-indigo-200"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              // Show Login/Register if user is not logged in
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 transition-colors rounded-md hover:bg-indigo-700"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-indigo-600 transition-colors bg-white rounded-md hover:bg-indigo-100"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>

        {isMenuOpen && (
          <div className="px-4 py-3 bg-indigo-700 md:hidden">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/courses"
                className="transition-colors hover:text-indigo-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="transition-colors hover:text-indigo-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {user?.role === "teacher" && (
                    <Link
                      to="/teacher"
                      className="transition-colors hover:text-indigo-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Teacher Portal
                    </Link>
                  )}

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="transition-colors hover:text-indigo-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Portal
                    </Link>
                  )}

                  <Link
                    to="/dashboard/profile"
                    className="transition-colors hover:text-indigo-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left transition-colors hover:text-indigo-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="transition-colors hover:text-indigo-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="transition-colors hover:text-indigo-200"
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

      <main className="container flex-grow px-4 py-6 mx-auto">
        <Outlet />
      </main>

      <footer className="py-10 pb-0 text-white bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
            <div>
              <h3 className="text-lg font-semibold">About Us</h3>
              <p className="mt-2 text-sm">
                AI Learning Platform provides high-quality courses to enhance
                your skills and knowledge.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-2 text-sm">
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
              <div className="flex justify-center mt-2 space-x-4 md:justify-start">
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
              {user ? (
                <>
                  <div className="max-w-md">
                    {user.role === "student" && (
                      <div>
                        <p className="text-lg font-semibold text-white">
                          Your Rating:
                        </p>

                        {/* Star Rating Component */}
                        {/* Star Rating */}
                        <div className="flex mt-2 space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setNewRating(star)}
                              className={`cursor-pointer text-2xl ${
                                star <= newRating
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        {/* Comment Box */}
                        <textarea
                          className="w-full p-2 mt-2 border rounded-md"
                          placeholder="Leave a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />

                        {/* Submit Button */}
                        <button
                          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md"
                          onClick={handleReviewSubmit}
                        >
                          Submit Feedback
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="max-w-md">
                  <p className="text-lg text-white">
                    Please login to leave a review
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
      <p className="text-sm text-center text-white bg-gray-800">
        &copy; {new Date().getFullYear()} AI Learning Platform. All rights
        reserved.
      </p>
    </div>
  );
}

export default MainLayout;
