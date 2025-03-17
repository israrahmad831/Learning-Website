import React, { useState, useEffect } from "react";
import { PlusCircle, MessageCircle, Edit, Trash2 } from "lucide-react"; // Added missing imports
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const fetchLessons = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLessons([
        {
          _id: "101",
          title: "Introduction to JavaScript",
          course: "JavaScript Basics",
        },
        { _id: "102", title: "React Components", course: "React Development" },
      ]);
    };

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

    fetchLessons();
  }, []);

  // Function to handle reply submission
  const handleReply = (discussionId) => {
    if (!replyText[discussionId]) return;

    const updatedDiscussions = discussions.map((discussion) => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          responses: [
            ...discussion.responses,
            {
              responder: "Teacher (You)",
              role: "Teacher",
              response: replyText[discussionId],
            },
          ],
        };
      }
      return discussion;
    });

    setDiscussions(updatedDiscussions);
    setReplyText({ ...replyText, [discussionId]: "" });
  };

  return (
    <div className="space-y-8">
      {/* Lesson Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Your Lessons</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
          <PlusCircle className="h-5 w-5 mr-2" /> Add New Lesson
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Lessons</h2>
        {lessons.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No lessons added yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex justify-between items-center py-4"
              >
                <div>
                  <h3 className="font-medium">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.course}</p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to={`/teacher/edit-lesson/${lesson._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button className="text-red-600 hover:underline">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

              {/* Reply Input Field */}
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
    </div>
  );
};

export default TeacherDashboard;
