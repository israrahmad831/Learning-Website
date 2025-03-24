import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, Clock, Award, BarChart2, PlayCircle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);
  const [averageProgress, setAverageProgress] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("🚨 No token found! Redirecting to login...");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setEnrolledCourses(data.enrolledCourses || []);
        setRecentLessons(data.recentLessons?.reverse() || []); // ✅ Show recent first
        setAverageProgress(data.averageProgress || 0);
        setCompletedCourses(data.completedCourses || 0);
      } catch (error) {
        console.error("🚨 Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-1">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-200 text-lg">
          Let’s continue where you left off.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <BookOpen className="h-10 w-10 text-indigo-500" />,
            title: "Enrolled Courses",
            value: enrolledCourses.length,
          },
          {
            icon: <BarChart2 className="h-10 w-10 text-indigo-500" />,
            title: "Average Progress",
            value: `${Math.round(averageProgress)}%`,
          },
          {
            icon: <Award className="h-10 w-10 text-indigo-500" />,
            title: "Completed Courses",
            value: completedCourses,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition"
          >
            {stat.icon}
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                {stat.title}
              </h2>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Your Courses
        </h2>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              You haven't enrolled in any courses yet.
            </p>
            <Link
              to="/courses"
              className="inline-block bg-indigo-600 text-white px-5 py-3 rounded-md hover:bg-indigo-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="block bg-gray-50 rounded-lg p-5 hover:shadow-xl transition-shadow border border-gray-200"
              >
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{course.language}</p>

                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {course.progress}% complete
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Lessons Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Recent Activity
        </h2>

        {recentLessons.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No recent activity to show.
          </p>
        ) : (
          <div className="space-y-4">
            {recentLessons.map((lesson) => (
              <Link
                key={lesson._id}
                to={`/dashboard/lesson/${lesson._id}`}
                className=" p-4 rounded-md shadow-sm hover:bg-gray-100 transition flex justify-between items-center border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <PlayCircle className="h-6 w-6 text-indigo-500" />
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600">{lesson.courseName}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(lesson.lastAccessed)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
