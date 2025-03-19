import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MessageSquare, Trash2, User, PlusCircle, Search } from "lucide-react";

const Discussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([
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
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddDiscussion = () => {
    if (newQuestion.trim() === "" || !user) return;
    const newDiscussion = {
      id: Date.now(),
      user: user.name,
      question: newQuestion,
      responses: [],
    };
    setDiscussions([...discussions, newDiscussion]);
    setNewQuestion("");
  };

  const handleAddReply = (discussionId) => {
    if (!replyTexts[discussionId] || !user) return;
    setDiscussions((prevDiscussions) =>
      prevDiscussions.map((discussion) =>
        discussion.id === discussionId
          ? {
              ...discussion,
              responses: [
                ...discussion.responses,
                {
                  responder: user.name,
                  role: user.role,
                  response: replyTexts[discussionId],
                },
              ],
            }
          : discussion
      )
    );
    setReplyTexts((prev) => ({ ...prev, [discussionId]: "" }));
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

  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.question.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Hide "Ask a Question" when searching */}
      {!searchQuery && (
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
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" /> Add
            </button>
          </div>
        </div>
      )}

      {/* Discussion List */}
      {filteredDiscussions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            No discussions found
          </h2>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          {filteredDiscussions.map((discussion) => (
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
                {user && user.name === discussion.user && (
                  <button
                    onClick={() =>
                      setDiscussions(
                        discussions.filter((d) => d.id !== discussion.id)
                      )
                    }
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
                          onClick={() =>
                            handleDeleteReply(discussion.id, index)
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
                  value={replyTexts[discussion.id] || ""}
                  onChange={(e) =>
                    setReplyTexts((prev) => ({
                      ...prev,
                      [discussion.id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                />
                <button
                  onClick={() => handleAddReply(discussion.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussions;
