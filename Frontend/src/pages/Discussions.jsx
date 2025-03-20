import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MessageSquare, Trash2, User, PlusCircle, Search } from "lucide-react";
import axios from "axios";

const Discussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/discussions");
      setDiscussions(res.data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  const handleAddDiscussion = async () => {
    if (!newQuestion.trim()) return;
    try {
      await axios.post("http://localhost:5001/api/discussions", {
        user: user.name,
        question: newQuestion,
      });
      setNewQuestion("");
      fetchDiscussions();
    } catch (error) {
      console.error("Error adding discussion:", error);
    }
  };

  const handleDeleteDiscussion = async (id, discussionUser) => {
    if (user.role !== "admin" && user.name !== discussionUser) return;
    try {
      await axios.delete(`http://localhost:5001/api/discussions/${id}`, {
        data: { user: user.name, role: user.role },
      });
      fetchDiscussions();
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  const handleAddReply = async (id) => {
    if (!replyTexts[id]?.trim()) return;
    try {
      await axios.post(`http://localhost:5001/api/discussions/${id}/reply`, {
        responder: user.name,
        role: user.role,
        response: replyTexts[id],
      });
      setReplyTexts((prev) => ({ ...prev, [id]: "" }));
      fetchDiscussions();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteReply = async (discussionId, replyId, replyUser) => {
    if (user.role !== "admin" && user.name !== replyUser) return;
    try {
      await axios.delete(
        `http://localhost:5001/api/discussions/${discussionId}/reply/${replyId}`,
        {
          data: { user: user.name, role: user.role },
        }
      );
      fetchDiscussions();
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  // Filter discussions based on search query
  const filteredDiscussions = discussions.filter((d) =>
    d.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 px-6 py-4">
      <h1 className="text-3xl font-bold text-gray-800">Discussions</h1>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      </div>

      {/* New Discussion Input */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800">Ask a Question</h2>
        <div className="flex gap-4 mt-2">
          <input
            type="text"
            placeholder="Type your question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={handleAddDiscussion}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1"
          >
            <PlusCircle className="h-5 w-5" /> Add
          </button>
        </div>
      </div>

      {/* Discussions List */}
      {filteredDiscussions.map((discussion) => (
        <div
          key={discussion._id}
          className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50 border divide-y divide-gray-200 my-5"
        >
          <div className="flex justify-between items-center bg-indigo-600 p-3 rounded-t-lg">
            <h2 className="text-lg font-semibold flex items-center text-white">
              <User className="h-5 w-5 text-blue-500 mr-2" />
              {discussion.user}
            </h2>
          </div>
          <div className="flex flex-row bg-gray-100 rounded-md p-4 justify-between items-center mt-4">
            <h2 className="text-lg font-semibold mt-2 text-gray-800">
              {discussion.question}
            </h2>
            {user?.role === "admin" || user?.name === discussion.user ? (
              <button
                onClick={() =>
                  handleDeleteDiscussion(discussion._id, discussion.user)
                }
                className="text-red-600 ml-2 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            ) : null}
          </div>
          {discussion.responses.map((reply) => (
            <div
              key={reply._id}
              className="bg-gray-100 rounded-md p-4 flex justify-between items-center mt-4"
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
              {user?.role === "admin" || user?.name === reply.responder ? (
                <button
                  onClick={() =>
                    handleDeleteReply(
                      discussion._id,
                      reply._id,
                      reply.responder
                    )
                  }
                  className="text-red-600 ml-2 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              ) : null}
            </div>
          ))}
          <div className="mt-4 flex gap-4">
            <input
              type="text"
              placeholder="Type a reply..."
              value={replyTexts[discussion._id] || ""}
              onChange={(e) =>
                setReplyTexts((prev) => ({
                  ...prev,
                  [discussion._id]: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={() => handleAddReply(discussion._id)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <MessageSquare className="h-5 w-5" /> Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Discussions;
