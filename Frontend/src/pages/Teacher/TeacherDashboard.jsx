import React, { useState, useEffect } from "react";
import { PlusCircle, MessageCircle, Edit, User, Trash2 } from "lucide-react"; // Added missing imports
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
const TeacherDashboard = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [replyText, setReplyText] = useState({});
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

    fetchLessons();
  }, []);

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
      <h1 className="text-2xl font-bold mb-4">Welcome back {user.name}</h1>
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
      <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200 my-5">
        <div className="flex justify-between items-center bg-indigo-600 p-3 rounded-t-lg">
          <h2 className="text-lg font-semibold flex items-center text-white">
            <MessageCircle className="mr-2" /> Student Discussions (Teacher
            Panel)
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
    </div>
  );
};

export default TeacherDashboard;
