import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  User,
  UserCheck,
  UserCog,
  MessageCircle,
  Star,
  Trash2,
} from "lucide-react";

import axios from "axios";
const AdminDashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("teachers");
  const [discussions, setDiscussions] = useState([]);
  const [replyText, setReplyText] = useState({});

  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState({
    admins: [],
    teachers: [],
    students: [],
  });

  const fetchStudentProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/student-progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching student progress:", error);
      return [];
    }
  };

  const fetchUsers = async (role) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/users?role=${role}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let usersData = response.data;

      if (role === "student") {
        const studentProgressData = await fetchStudentProgress();

        if (!studentProgressData || studentProgressData.length === 0) {
          console.warn("No student progress data found!");
        }

        usersData = usersData.map((student) => {
          // Match progress data using `_id` from student and `id` from progress data
          const studentProgress = studentProgressData.find(
            (s) => String(s.id) === String(student._id)
          );

          return {
            ...student,
            averageProgress: studentProgress
              ? studentProgress.averageProgress
              : 0,
          };
        });
      }

      return usersData;
    } catch (error) {
      console.error(`Error fetching ${role}s:`, error);
      return [];
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      const [admins, teachers, students] = await Promise.all([
        fetchUsers("admin"),
        fetchUsers("teacher"),
        fetchUsers("student"),
      ]);
      setUsers({ admins, teachers, students });
    };

    loadUsers();
  }, []);

  useEffect(() => {}, [users]);

  //delete feedback
  const handleDeleteFeedback = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized. Please login as admin.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/feedback/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete feedback");
      }

      setFeedbacks((prev) => prev.filter((f) => f._id !== id)); // Remove deleted feedback from state
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert(error.message);
    }
  };

  const { admins, teachers, students } = users;
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/feedback`);
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

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
        role: "admin",
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

  const handleDeleteDiscussion = async (discussionId) => {
    if (!user || (user.role !== "admin" && user.name !== discussion.user)) {
      console.error("Not authorized to delete this discussion.");
      return;
    }

    try {
      const endpoint =
        user.role === "admin"
          ? `/api/admin/discussions/${discussionId}`
          : `/api/discussions/${discussionId}`;

      await axios.delete(`${BACKEND_URL}${endpoint}`, {
        data: { user: user.name, role: user.role },
      });

      setDiscussions((prev) =>
        prev.filter((discussion) => discussion._id !== discussionId)
      );
    } catch (err) {
      console.error(
        "Error deleting discussion:",
        err.response?.data || err.message
      );
    }
  };

  const handleDeleteReply = async (discussionId, replyId, responder) => {
    if (!user) return;

    const isAdmin = user.role === "admin";
    const isReplyOwner = user.name === responder;

    if (!isAdmin && !isReplyOwner) {
      console.error("Not authorized to delete this reply.");
      return;
    }

    try {
      const endpoint = isAdmin
        ? `/api/admin/discussions/${discussionId}/replies/${replyId}`
        : `/api/discussions/${discussionId}/reply/${replyId}`;

      await axios.delete(`${BACKEND_URL}${endpoint}`, {
        data: { user: user.name, role: user.role },
      });

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

  const renderTable = () => {
    let data =
      activeTab === "teachers"
        ? users?.teachers || []
        : activeTab === "students"
        ? users?.students || []
        : users?.admins || [];

    return (
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <th className="px-6 py-3 text-left font-semibold uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left font-semibold uppercase">
                Email
              </th>
              {activeTab === "students" && (
                <th className="px-6 py-3 text-left">Progress</th>
              )}
              {(activeTab === "students" || activeTab === "teachers") && (
                <th className="px-6 py-3 text-left">Actions</th>
              )}
              {activeTab === "admins" && (
                <th className="px-6 py-3 text-left"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  {activeTab === "students" && (
                    <td className="px-6 py-4">
                      {user.averageProgress !== undefined
                        ? `${user.averageProgress}%`
                        : "Loading..."}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {(activeTab === "students" || activeTab === "teachers") && (
                      <Link
                        to={`/admin/${activeTab}/${encodeURIComponent(
                          user.name
                        )}`}
                        className="text-indigo-600 hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
      <p className="text-gray-600  mb-6">
        Welcome back, {user.name}. Here's what's happening on your platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: UserCheck, title: "Total Teachers", count: teachers.length },
          { icon: Users, title: "Total Students", count: students.length },
          { icon: UserCog, title: "Total Admins", count: admins.length },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg flex items-center"
          >
            <item.icon className="h-10 w-10 mr-4" />
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-3xl font-bold">{item.count}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-4 mb-6">
        {["teachers", "students", "admins"].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-lg transition duration-300 ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {renderTable()}
      {/* Discussion Section */}
      <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200 my-5">
        <div className="flex justify-between items-center bg-indigo-600 p-3 rounded-t-lg">
          <h2 className="text-lg font-semibold flex items-center text-white">
            <MessageCircle className="mr-2" /> Student Discussions (Admin Panel)
          </h2>
        </div>

        {discussions.map((discussion) => (
          <div key={discussion._id} className="p-6 hover:bg-gray-50">
            {/* Question Section */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {discussion.question}
                </h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" /> {discussion.user}
                </p>
              </div>

              {/* Admin Delete Discussion Button */}
              {user && user.role === "admin" && (
                <button
                  onClick={() => handleDeleteDiscussion(discussion._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Responses Section */}
            {discussion.responses.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-md font-medium text-gray-700">
                  Responses:
                </h3>
                {discussion.responses.map((reply) => (
                  <div
                    key={reply._id}
                    className="bg-gray-100 rounded-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm text-gray-500">
                        {reply.responder}
                        <span className="ml-4 px-4 py-1 rounded-2xl text-white bg-blue-500">
                          {reply.role}
                        </span>
                      </p>
                      <p className="text-gray-800">{reply.response}</p>
                    </div>

                    {/* Admin can delete any reply, users can delete their own */}
                    {user &&
                      (user.role === "admin" ||
                        user.name === reply.responder) && (
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
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div className="mt-4 flex gap-4">
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
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Feedback & Ratings Section */}
      <div className="bg-white shadow-lg rounded-lg mt-8">
        <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center rounded-t-lg">
          <Star className="mr-2" /> Feedback & Ratings
        </h2>
        <div className="p-6 space-y-4">
          {feedbacks.length === 0 ? (
            <p className="text-gray-600">No feedback yet.</p>
          ) : (
            feedbacks.map((f) => (
              <div
                key={f._id}
                className="flex items-start bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
              >
                {/* User Initial (Avatar) */}
                <div className="h-12 w-12 bg-indigo-500 text-white flex items-center justify-center rounded-full text-lg font-semibold mr-4">
                  {f.studentId.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  {/* User Name */}
                  <p className="text-lg font-semibold text-gray-800">
                    {f.studentId.name}
                  </p>

                  {/* Star Rating (Fixed) */}
                  <div className="flex items-center text-yellow-500 my-1">
                    {"★".repeat(f.rating)}
                    {"☆".repeat(5 - f.rating)}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 text-sm italic">"{f.message}"</p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteFeedback(f._id)}
                  className="text-red-600 hover:text-red-800 ml-auto"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
