import React, { useState, useEffect } from "react";
import { PlusCircle, MessageCircle, Edit, User, Trash2 } from "lucide-react"; // Added missing imports
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const TeacherDashboard = () => {
  const { user } = useAuth();
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
              responder: user.name, 
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
                    {user && user.name === reply.responder && (
                      <button
                        onClick={() => handleDeleteReply(discussion.id, index)}
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
    </div>
  );
};

export default TeacherDashboard;
