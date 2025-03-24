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
              to={`/dashboard/discussions`}
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
                  {lesson?.content ? (
                    <TypingEffect text={lesson.content} />
                  ) : (
                    <div className="text-indigo-600 text-lg font-semibold flex items-center">
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
                        <div className="flex justify-between items-start mb-4">
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

                        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                          <TypingEffect text={example?.code} speed={2} />
                        </pre>

                        {selectedExample === example?.id && (
                          <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
                            <TypingEffect
                              text={example?.explanation}
                              speed={3}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-indigo-600 text-lg font-semibold flex items-center">
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
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Course Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
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
              {lesson.nextLesson === null && (
                <div className="text-center p-4 border border-gray-300 rounded-md bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">
                    🎓 Earn Your Certificate!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete the final quiz to receive your official course
                    certificate.
                  </p>
                  {hasCertificate ? (
                    <div className="text-center p-4 border border-green-500 rounded-md bg-green-50">
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
                        className="mt-3 block w-full text-center py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
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
                  className="block w-full bg-gray-100 text-gray-700 text-center py-2 rounded-md hover:bg-gray-200 transition-colors"
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
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
        {loadingText}
      </p>
      <div className="relative flex space-x-2">
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};
