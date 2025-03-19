import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Code,
  PlayCircle,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import ReactMarkdown from 'react-markdown'


const Lesson = () => {

  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [selectedExample, setSelectedExample] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => { 
    const fetchLessonDetails = async () => {
        try {
            setIsLoading(true); // Start loading
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate delay
            
            const response = await fetch("/lesson.json"); // Fetching from the public folder
            const data = await response.json();

            // Convert lessonId to a number before searching
            const foundLesson = data.find((lesson) => lesson._id === Number(id));
            setLesson(foundLesson || null);
        } catch (error) {
            console.error("Error fetching lesson details:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    fetchLessonDetails();
}, [id]);


if (isLoading) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
        Generating with AI...
      </p>
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-300 opacity-30 rounded-full animate-ping"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-600 border-b-indigo-600 border-l-transparent border-r-transparent"></div>
      </div>
    </div>
  );
}


  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Lesson Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The lesson you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/dashboard"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Lesson Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            //dp mapping of Lessons
            <h1 className="text-2xl font-bold mb-2">{lesson?.title}</h1>
            <p className="text-gray-600">
              {lesson?.courseName} • Lesson {lesson?.order}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-1" />
              <span>{lesson?.duration} min</span>
            </div>
            <Link
              to={`/discussions/lesson=${lesson?._id}`}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <MessageSquare className="h-5 w-5 mr-1" />
              <span>Discussions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lesson Navigation */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          {lesson?.previousLesson ? (
            <Link
              to={`/dashboard/lesson/${lesson?.previousLesson.id}`}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>{lesson?.previousLesson.title}</span>
            </Link>
          ) : (
            <div></div>
          )}

          {lesson?.nextLesson && (
            <Link
              to={`/dashboard/lesson/${lesson?.nextLesson.id}`}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <span>{lesson?.nextLesson.title}</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === "content"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FileText className="h-5 w-5 inline mr-2" />
                  Lesson Content
                </button>
                <button
                  onClick={() => setActiveTab("examples")}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === "examples"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Code className="h-5 w-5 inline mr-2" />
                  Code Examples
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "content" ? (
                <div className="prose max-w-none">
                  {/* map content in html tags*/}
                  <ReactMarkdown>{lesson?.content}</ReactMarkdown>

                </div>
              ) : (
                <div className="space-y-6">
                  {lesson?.codeExamples.map((example) => (
                    <div
                      key={example.id}
                      className={`border rounded-lg p-4 ${
                        selectedExample === example.id
                          ? "border-indigo-500"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">{example?.title}</h3>
                        <button
                          onClick={() =>
                            setSelectedExample(
                              selectedExample === example.id ? null : example.id
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {selectedExample === example.id ? "Hide" : "Show"}{" "}
                          Explanation
                        </button>
                      </div>

                      <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>

                      {selectedExample === example.id && (
                        <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
                          <p className="text-sm text-gray-800">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Course Progress</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Additional Resources</h2>
            <div className="space-y-3">
              {lesson?.resources.map((resource, index) => (
                <div
                  key={index}
                  className="p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {resource.type === "video" ? (
                    <button
                      onClick={() => setSelectedVideo(resource.url)}
                      className="flex items-center w-full text-left"
                    >
                      <PlayCircle className="h-5 w-5 text-red-500 mr-3" />
                      <span className="text-gray-700 hover:text-gray-900">
                        {resource.title}
                      </span>
                    </button>
                  ) : (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FileText className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-gray-700 hover:text-gray-900">
                        {resource.title}
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={() => setSelectedVideo(null)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <iframe
                    className="w-full h-64 sm:h-80 md:h-96 rounded-lg"
                    src={
                      "https://www.youtube.com/embed/ajdRvxDWH4w?si=-i9LPJHDEp2yMAtF"
                    }
                    title="YouTube Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
            <div className="space-y-4">
              <Link
                to={`/dashboard/quiz/${lesson?.quiz.id}`}
                className="block w-full bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Take Quiz
              </Link>

              {lesson?.nextLesson && (
                <Link
                  to={`/dashboard/lesson/${lesson?.nextLesson.id}`}
                  className="block w-full bg-gray-100 text-gray-700 text-center py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Next Lesson: {lesson?.nextLesson.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
