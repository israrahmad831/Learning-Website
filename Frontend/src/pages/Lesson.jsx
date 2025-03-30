import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
import ReactMarkdown from "react-markdown";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const TypingEffect = ({ text = "", speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text]); // Depend only on `text`

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

const Lesson = () => {
  const { id } = useParams();
  const { user, loading, fetchUser, isAuthenticated } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [selectedExample, setSelectedExample] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔄 Checking auth state...", { user });

    // If authentication is still loading, wait
    if (loading) {
      console.warn("⏳ Waiting for authentication...");
      return;
    }

    // If user is null, try fetching user
    if (!user) {
      console.warn("🔄 Fetching user...");
      fetchUser();
      return;
    }

    // If authentication still fails, show error
    if (!isAuthenticated || !user?._id) {
      console.error("❌ User not authenticated");
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    const fetchLessonDetails = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Ensure token is present
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ Authentication token missing");
          setError("Authentication token missing");
          setIsLoading(false);
          return;
        }

        console.log("📡 Fetching lesson details...");

        const response = await fetch(`${BACKEND_URL}/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch lesson details");

        const data = await response.json();
        setLesson(data);
        console.log("✅ Lesson fetched:", data);

        // ✅ Fetch progress
        const progressResponse = await fetch(
          `${BACKEND_URL}/api/courses/${data.courseId}/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setProgress(progressData.progress || 0);
          setIsCompleted(progressData.completedLessons.includes(id));
          console.log("📊 Progress:", progressData);
        }

        // ✅ Fetch certificates
        const certificateResponse = await fetch(
          `${BACKEND_URL}/api/certificates/${user._id || user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (certificateResponse.ok) {
          const certificates = await certificateResponse.json();
          setHasCertificate(
            certificates.some((cert) => cert.courseId === data.courseId)
          );
          console.log("🎓 Certificates:", certificates);
        }
      } catch (err) {
        console.error("❌ Error fetching lesson details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonDetails();
  }, [id, user, loading]);
  const handleCompleteLesson = async () => {
    if (isCompleted || !lesson) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to complete the lesson.");
      return;
    }

    try {
      console.log("✅ Marking lesson as completed...");
      const response = await fetch(
        `${BACKEND_URL}/api/courses/${lesson.courseId}/complete-lesson`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lessonId: id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update lesson completion"
        );
      }

      const data = await response.json();
      console.log("✅ Lesson completion updated:", data);
      setIsCompleted(true);
      setProgress(data.progress);
    } catch (error) {
      console.error("❌ Error completing lesson:", error);
      alert(error.message);
    }
  };

  if (isLoading) {
    return <AILoading />;
  }

  if (!lesson) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Lesson Not Found
        </h2>
        <p className="mb-6 text-gray-600">
          The lesson you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-2 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Lesson Header */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold">{lesson?.title}</h1>
            <p className="text-gray-600">
              {lesson?.courseName} • Lesson {lesson?.order}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-1" />
              <span>{lesson?.duration} min</span>
            </div>
            {user?.role === "student" && (
              <Link
                to={`/dashboard/discussions`}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <MessageSquare className="w-5 h-5 mr-1" />
                <span>Discussions</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Navigation */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          {lesson?.previousLesson ? (
            <Link
              to={`/dashboard/lesson/${lesson?.previousLesson.id}`}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
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
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Content Tabs */}
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
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
                  <FileText className="inline w-5 h-5 mr-2" />
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
                  <Code className="inline w-5 h-5 mr-2" />
                  Code Examples
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "content" ? (
                <div className="prose max-w-none">
                  {lesson?.content ? (
                    <TypingEffect text={lesson.content} />
                  ) : (
                    <div className="flex items-center text-lg font-semibold text-indigo-600">
                      <span className="animate-pulse">
                        Generating with AI...
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {lesson?.codeExamples?.length > 0 ? (
                    lesson.codeExamples.map((example) => (
                      <div
                        key={example.id}
                        className={`border rounded-lg p-4 ${
                          selectedExample === example.id
                            ? "border-indigo-500"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-medium">{example?.title}</h3>
                          <button
                            onClick={() =>
                              setSelectedExample(
                                selectedExample === example.id
                                  ? null
                                  : example.id
                              )
                            }
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {selectedExample === example.id ? "Hide" : "Show"}{" "}
                            Explanation
                          </button>
                        </div>

                        <pre className="p-4 overflow-x-auto text-white bg-gray-800 rounded-md">
                          <TypingEffect text={example?.code} speed={2} />
                        </pre>

                        {selectedExample === example?.id && (
                          <div className="p-4 mt-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-md">
                            <TypingEffect
                              text={example?.explanation}
                              speed={3}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center text-lg font-semibold text-indigo-600">
                      <span className="animate-pulse">
                        This content is out my limit
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          {user?.role === "student" && (
            <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Your Progress</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Course Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Resources */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Additional Resources</h2>
            <div className="space-y-3">
              {lesson?.resources.map((resource, index) => (
                <div
                  key={index}
                  className="p-3 transition-colors rounded-md hover:bg-gray-50"
                >
                  {resource.type === "video" ? (
                    <button
                      onClick={() => setSelectedVideo(resource.url)}
                      className="flex items-center w-full text-left"
                    >
                      <PlayCircle className="w-5 h-5 mr-3 text-red-500" />
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
                      <FileText className="w-5 h-5 mr-3 text-blue-500" />
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative w-full max-w-3xl p-4 bg-white rounded-lg">
                  <button
                    className="absolute text-gray-500 top-2 right-2 hover:text-gray-800"
                    onClick={() => setSelectedVideo(null)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <iframe
                    className="w-full h-64 rounded-lg sm:h-80 md:h-96"
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
          {user?.role === "student" && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Next Steps</h2>
              <div className="space-y-4">
                {lesson.nextLesson === null && (
                  <div className="p-4 text-center border border-gray-300 rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">
                      🎓 Earn Your Certificate!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Complete the final quiz to receive your official course
                      certificate.
                    </p>
                    {hasCertificate ? (
                      <div className="p-4 text-center border border-green-500 rounded-md bg-green-50">
                        <h3 className="text-lg font-semibold text-green-800">
                          🎉 Certificate Earned!
                        </h3>
                        <p className="text-sm text-gray-600">
                          You've successfully completed the course and earned a
                          certificate.
                        </p>
                        <a
                          href={`/dashboard/profile`}
                          // Link to certificate
                          className="block w-full py-2 mt-3 text-center text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                        >
                          View Certificate
                        </a>
                      </div>
                    ) : (
                      <Link
                        to={
                          progress > 80
                            ? `/dashboard/quiz/${lesson?.courseId}`
                            : "#"
                        }
                        className={`mt-3 block w-full text-center py-2 rounded-md transition-colors ${
                          progress > 80
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        {progress > 80
                          ? "Take Final Quiz"
                          : "Complete More Lessons to Unlock"}
                      </Link>
                    )}
                  </div>
                )}

                {lesson?.nextLesson && (
                  <Link
                    to={`/dashboard/lesson/${lesson?.nextLesson.id}`}
                    className="block w-full py-2 text-center text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Next Lesson: {lesson?.nextLesson.title}
                  </Link>
                )}
                <button
                  onClick={handleCompleteLesson}
                  className={`w-full py-3 px-6 rounded-md text-white font-bold transition ${
                    isCompleted
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  disabled={isCompleted}
                >
                  {isCompleted ? "✅ Lesson Completed" : "Mark as Completed"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lesson;
const AILoading = () => {
  const [loadingText, setLoadingText] = useState("Initializing AI...");
  const messages = [
    "Gathering knowledge...",
    "Analyzing data...",
    "Generating insights...",
    "Finalizing response...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLoadingText(messages[index]);

      if (index >= messages.length - 1) {
        clearInterval(interval);
      } else {
        index++;
      }
    }, 2000); // Changes text every 2 seconds for realism

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <p className="mb-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400 animate-pulse">
        {loadingText}
      </p>
      <div className="relative flex space-x-2">
        <div className="w-3 h-3 delay-100 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 delay-200 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 delay-300 bg-indigo-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};
