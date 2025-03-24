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
            {user ? (
              <>
                {/* Common Dashboard Link for Students */}
                {user.role === "student" && (
                  <div className="md:flex space-x-6">
                    <Link
                      to="/dashboard"
                      className="hover:text-indigo-200 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/courses"
                      className="hover:text-indigo-200 transition-colors"
                    >
                      Courses
                    </Link>
                  </div>
                )}

                {/* Teacher Portal Link */}
                {user.role === "teacher" && (
                  <Link
                    to="/teacher"
                    className="hover:text-indigo-200 transition-colors"
                  >
                    Teacher Portal
                  </Link>
                )}

                {/* Admin Portal Link */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hover:text-indigo-200 transition-colors"
                  >
                    Admin Portal
                  </Link>
                )}

                {/* Profile and Logout */}
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center space-x-1 hover:text-indigo-200 transition-colors"
                  >
                    <User size={18} />
                    <span>{user.name}</span>
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
              // Show Login/Register if user is not logged in
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

      <footer className="bg-gray-800 text-white py-10 pb-0">
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
                        <div className="flex space-x-1 mt-2">
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
                          className="w-full p-2 border rounded-md mt-2"
                          placeholder="Leave a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />

                        {/* Submit Button */}
                        <button
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
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
      <p className="bg-gray-800 text-center text-sm text-white">
        &copy; {new Date().getFullYear()} AI Learning Platform. All rights
        reserved.
      </p>
    </div>
  );
}

export default MainLayout;
