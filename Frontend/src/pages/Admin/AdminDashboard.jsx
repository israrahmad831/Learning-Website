import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, UserCog, MessageCircle, Star } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("teachers");

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

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
      { id: 1, name: "Ahmad", email: "Ahmad@gmail.com" },
    ]);

    setDiscussions([
      { id: 1, user: "Israr Ahmad", topic: "ReactJs", status: "Pending" },
      { id: 2, user: "Mehboob Ali", topic: "NextJS", status: "Approved" },
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

  const renderTable = () => {
    let data =
      activeTab === "teachers"
        ? teachers
        : activeTab === "students"
        ? students
        : admins;

    return (
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
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
                      to={`/admin/users/${user.id}`}
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
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg flex items-center"
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
      <div className="bg-white shadow-lg rounded-lg mt-8">
        <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white flex items-center rounded-t-lg">
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
