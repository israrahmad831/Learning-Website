import React, { useState, useEffect } from "react";
import { PlusCircle, MessageCircle, Edit, User, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { Search, Filter, BookOpen } from "lucide-react";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const languages = [...new Set(courses.map((course) => course.language))];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockCourses = [
          {
            _id: "1",
            title: "JavaScript Fundamentals",
            description:
              "Learn the core concepts of JavaScript programming language.",
            language: "JavaScript",
            level: "Beginner",
            lessons: 12,
            students: 1245,
            rating: 4.7,
            image:
              "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            _id: "2",
            title: "Python for Beginners",
            description:
              "Start your journey with Python, one of the most popular programming languages.",
            language: "Python",
            level: "Beginner",
            lessons: 15,
            students: 2130,
            rating: 4.8,
            image:
              "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            _id: "3",
            title: "Advanced React Patterns",
            description:
              "Master advanced React concepts and patterns for building scalable applications.",
            language: "JavaScript",
            level: "Advanced",
            lessons: 10,
            students: 845,
            rating: 4.9,
            image:
              "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            _id: "4",
            title: "Java Programming Masterclass",
            description:
              "Comprehensive guide to Java programming from basics to advanced topics.",
            language: "Java",
            level: "Intermediate",
            lessons: 20,
            students: 1560,
            rating: 4.6,
            image:
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            _id: "5",
            title: "C++ Fundamentals",
            description:
              "Learn the basics of C++ programming language and object-oriented concepts.",
            language: "C++",
            level: "Beginner",
            lessons: 14,
            students: 980,
            rating: 4.5,
            image:
              "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            _id: "6",
            title: "Data Structures in Python",
            description:
              "Master essential data structures implementation using Python.",
            language: "Python",
            level: "Intermediate",
            lessons: 16,
            students: 1120,
            rating: 4.7,
            image:
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
        ];

        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let results = courses;

    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLanguage) {
      results = results.filter(
        (course) => course.language === selectedLanguage
      );
    }

    if (selectedLevel) {
      results = results.filter((course) => course.level === selectedLevel);
    }

    setFilteredCourses(results);
  }, [searchTerm, selectedLanguage, selectedLevel, courses]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/discussions`).then((res) => {
      setDiscussions(res.data);
    });
  }, []);

  // Function to handle teacher replies
  const handleReply = (discussionId) => {
    if (!replyText[discussionId] || !user) return;

    axios
      .post(`${BACKEND_URL}/api/discussions/${discussionId}/reply`, {
        responder: user.name,
        role: "teacher",
        response: replyText[discussionId],
        responderId: user.id,
      })
      .then((res) => {
        setDiscussions((prev) =>
          prev.map((discussion) =>
            discussion._id === discussionId ? res.data : discussion
          )
        );
        setReplyText((prev) => ({ ...prev, [discussionId]: "" }));
      });
  };

  // Function to delete a teacher's reply
  const handleDeleteReply = async (discussionId, replyId, responder) => {
    if (!user || (user.role !== "admin" && user.name !== responder)) {
      console.error("Not authorized to delete this reply.");
      return;
    }

    try {
      await axios.delete(
        `${BACKEND_URL}/api/discussions/${discussionId}/replies/${replyId}`,
        { data: { user: user.name, role: user.role } }
      );

      setDiscussions((prev) =>
        prev.map((discussion) =>
          discussion._id === discussionId
            ? {
                ...discussion,
                responses: discussion.responses.filter(
                  (r) => r._id !== replyId
                ),
              }
            : discussion
        )
      );
    } catch (err) {
      console.error("Error deleting reply:", err.response?.data || err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Lesson Management */}
      <div className="space-y-8">
        <div className="container px-6 mx-auto">
          <h1 className="mb-1 text-3xl font-bold text-gray-800">
            Teacher Dashboard
          </h1>
          <p className="mb-6 font-bold text-gray-800">
            Welcome back, {user.name}. Here's what's happening on your platform.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full py-2 pl-3 pr-10 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Languages</option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full py-2 pl-3 pr-10 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-md">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="mb-2 text-xl font-semibold">No courses found</h2>
            <p className="mb-4 text-gray-600">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLanguage("");
                setSelectedLevel("");
              }}
              className="font-medium text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded">
                      {course.language}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{course.title}</h3>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{course.lessons} lessons</span>
                    <span>{course.students.toLocaleString()} students</span>
                  </div>

                  <div className="flex items-center mt-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(course.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {course.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Discussion Section */}
      <div className="my-5 bg-white divide-y divide-gray-200 rounded-lg shadow-md">
        <div className="flex items-center justify-between p-3 bg-indigo-600 rounded-t-lg">
          <h2 className="flex items-center text-lg font-semibold text-white">
            <MessageCircle className="mr-2" /> Student Discussions (Teacher
            Panel)
          </h2>
        </div>

        {discussions.map((discussion) => (
          <div key={discussion._id} className="p-6 hover:bg-gray-50">
            {/* Question Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {discussion.question}
                </h2>
                <p className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <User className="w-4 h-4 text-gray-400" /> {discussion.user}
                </p>
              </div>
            </div>

            {/* Responses Section */}
            {discussion.responses.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="font-medium text-gray-700 text-md">
                  Responses:
                </h3>
                {discussion.responses.map((reply) => (
                  <div
                    key={reply._id}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-md"
                  >
                    <div>
                      <p className="text-sm text-gray-500">
                        {reply.responder}
                        <span className="px-4 py-1 ml-4 text-white bg-blue-500 rounded-2xl">
                          {reply.role}
                        </span>
                      </p>
                      <p className="text-gray-800">{reply.response}</p>
                    </div>

                    {/* Allow teachers to delete only their own replies */}
                    {user && user.name === reply.responder && (
                      <button
                        onClick={() =>
                          handleDeleteReply(
                            discussion._id,
                            reply._id,
                            reply.responder
                          )
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div className="flex gap-4 mt-4">
              <input
                type="text"
                placeholder="Reply to this discussion..."
                value={replyText[discussion._id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({
                    ...prev,
                    [discussion._id]: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={() => handleReply(discussion._id)}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
