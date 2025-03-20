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
// import {env} from "dotenv";

import axios from "axios";
const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("teachers");
  const [users, setUsers] = useState({
    admins: [],
    teachers: [],
    students: [],
  });
  const [discussions, setDiscussions] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  //delete feedback
  const handleDeleteFeedback = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized. Please login as admin.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/feedback/${id}`, {
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
      const response = await fetch("http://localhost:5001/api/feedback");
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };
  const fetchUsers = async (role) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5001/api/admin/users?role=${role}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${role}s:`, error);
      return [];
    }
  };

  useEffect(() => {
    setDiscussions([
      {
        id: 1,
        user: "Israr Ahmad",
        question: "How does React state work?",
        responses: [
          {
            responder: "Teacher Jawaad",
            role: "Teacher",
            response: "React state stores dynamic data.",
          },
          {
            responder: "Admin Ahmad",
            role: "Admin",
            response: "State updates cause component re-renders.",
          },
        ],
      },
      {
        id: 2,
        user: "Mehboob Ali",
        question: "What is Express.js?",
        responses: [
          {
            responder: "Teacher Ahmad",
            role: "Teacher",
            response: "It's a web framework for Node.js.",
          },
        ],
      },
    ]);

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

  const handleReply = (discussionId) => {
    if (!replyText[discussionId]) return;
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId
          ? {
              ...d,
              responses: [
                ...d.responses,
                {
                  responder: "Admin (You)",
                  role: "Admin",
                  response: replyText[discussionId],
                },
              ],
            }
          : d
      )
    );
    setReplyText({ ...replyText, [discussionId]: "" });
  };
  const handleDeleteDiscussion = (id) => {
    setDiscussions(discussions.filter((d) => d.id !== id));
  };

  const handleDeleteReply = (discussionId, replyIndex) => {
    setDiscussions((prevDiscussions) =>
      prevDiscussions.map((discussion) =>
        discussion.id === discussionId
          ? {
              ...discussion,
              responses: discussion.responses.filter(
                (_, index) => index !== replyIndex
              ),
            }
          : discussion
      )
    );
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
                  key={user.id || index}
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  {activeTab === "students" && (
                    <td className="px-6 py-4">{user.progress}</td>
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
        Welcome back, {currentUser?.name}. Here's what's happening on your
        platform.
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
      <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200 my-5 ">
        <div className="flex justify-between items-center bg-indigo-600 p-3 rounded-t-lg">
          <h2 className=" text-lg font-semibold flex items-center text-white mb-4">
            <MessageCircle className="mr-2" /> Student Discussions (Admin Panel)
          </h2>
        </div>
        {discussions.map((discussion) => (
          <div key={discussion.id} className="p-6 hover:bg-gray-50">
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

              <button
                onClick={() => handleDeleteDiscussion(discussion.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {/* Responses Section */}
            {discussion.responses.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-md font-medium text-gray-700">
                  Responses:
                </h3>
                {discussion.responses.map((reply, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm text-gray-500">
                        {reply.responder}
                        <span className="m-7 px-4 py-1   rounded-2xl text-white bg-blue-500">
                          {reply.role}
                        </span>{" "}
                      </p>
                      <p className="text-gray-800">{reply.response}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReply(discussion.id, index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div className="mt-4 flex gap-4">
              <input
                type="text"
                placeholder="Reply to this discussion..."
                value={replyText[discussion.id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({
                    ...prev,
                    [discussion.id]: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={() => handleReply(discussion.id)}
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
