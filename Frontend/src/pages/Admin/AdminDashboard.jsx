import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Users, UserCheck, UserCog, MessageCircle, Star } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("teachers");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [user] = useAuth();
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    setTeachers([
      { id: 1, name: "Teacher Jawaad", email: "Jawaad@gmail.com" },
      { id: 2, name: "Teacher Ahmad", email: "Ahmad@gmail.com" },
    ]);

    setStudents([
      {
        id: 1,
        name: "Israr Ahmad",
        email: "Israrahmad@gmail.com",
        progress: "80%",
      },
      {
        id: 2,
        name: "Mehboob Ali",
        email: "Mehboobali@gmail.com",
        progress: "60%",
      },
    ]);

    setAdmins([
      { id: 1, name: "Jawaad", email: "Jawaad@gmail.com" },
      { id: 2, name: "Ahmad", email: "Ahmad@gmail.com" },
    ]);

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

    setFeedbacks([
      { id: 1, user: "Israr Ahmad", rating: 5, comment: "Great platform!" },
      {
        id: 2,
        user: "Mehboob Ali",
        rating: 4,
        comment: "Very helpful courses.",
      },
    ]);
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

  const renderTable = () => {
    let data =
      activeTab === "teachers"
        ? teachers
        : activeTab === "students"
        ? students
        : admins;

    return (
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}. Here's what's happening on your
            platform.
          </p>
        </div>
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
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  {activeTab === "students" && (
                    <td className="px-6 py-4">{user.progress}</td>
                  )}
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/${activeTab}/${user.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

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
      <div className="bg-white shadow-lg rounded-lg mt-8">
        <h2 className="text-lg font-semibold p-4 bg-indigo-600 text-white flex items-center rounded-t-lg">
          <MessageCircle className="mr-2" /> Student Discussions
        </h2>
        <div className="p-6 space-y-4">
          {discussions.map((d) => (
            <div
              key={d.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-200"
            >
              <p className="text-lg font-semibold text-gray-800">
                {d.user} asked:
              </p>
              <p className="text-gray-700 italic">"{d.question}"</p>

              <div className="mt-2 space-y-2">
                {d.responses.map((res, index) => (
                  <p
                    key={index}
                    className={`text-sm p-2 rounded-md mt-1 shadow ${
                      res.role === "Admin" ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    <strong>
                      {res.responder} ({res.role}):
                    </strong>{" "}
                    {res.response}
                  </p>
                ))}
              </div>

              <textarea
                className="w-full mt-2 p-2 border rounded"
                placeholder="Write a response..."
                value={replyText[d.id] || ""}
                onChange={(e) =>
                  setReplyText({ ...replyText, [d.id]: e.target.value })
                }
              ></textarea>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-indigo-700"
                onClick={() => handleReply(d.id)}
              >
                Reply
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Feedback & Ratings Section */}
      <div className="bg-white shadow-lg rounded-lg mt-8">
        <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center rounded-t-lg">
          <Star className="mr-2" /> Feedback & Ratings
        </h2>
        <div className="p-6 space-y-4">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="flex items-start bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
            >
              <div className="h-12 w-12 bg-indigo-500 text-white flex items-center justify-center rounded-full text-lg font-semibold mr-4">
                {f.user.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">{f.user}</p>
                <div className="flex items-center text-yellow-500 my-1">
                  {"★".repeat(f.rating)}
                  {"☆".repeat(5 - f.rating)}
                </div>
                <p className="text-gray-600 text-sm italic">"{f.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
