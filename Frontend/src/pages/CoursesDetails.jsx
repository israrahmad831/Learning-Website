import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, Clock, Star, MessageSquare } from "lucide-react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!user) {
        console.log("User not authenticated");
        return;
      }

      try {
        setIsLoading(true);

        const [courseResponse, studentsResponse, progressResponse] =
          await Promise.all([
            fetch(`${BACKEND_URL}/api/courses/${id}`),
            fetch(`${BACKEND_URL}/api/courses/${id}/enrolled-students`),
            fetch(`${BACKEND_URL}/api/courses/${id}/progress`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
          ]);

        if (!courseResponse.ok || !studentsResponse.ok) {
          throw new Error("Failed to fetch course or student details");
        }

        const courseData = await courseResponse.json();
        const studentsData = await studentsResponse.json();
        const progressData = await progressResponse.json();

        console.log("Course Data:", courseData);
        console.log("Students Data:", studentsData);
        console.log("Progress Data:", progressData);

        courseData.enrolledStudents = studentsData.enrolledStudents;
        courseData.isEnrolled = progressData.progress > 0;
        setProgress(progressData.progress);
        setCompletedLessons(progressData.completedLessons || []);

        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated || !user) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      setEnrolling(true);

      const response = await fetch(`${BACKEND_URL}/api/courses/${id}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to enroll in course");
      }

      const data = await response.json();

      if (data.isEnrolled) {
        setCourse((prev) => ({
          ...prev,
          isEnrolled: true,
          progress: 0,
          enrolledStudents: prev.enrolledStudents + 1,
        }));
      } else {
        console.warn(
          "Enrollment response does not contain expected data:",
          data
        );
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    } finally {
      setEnrolling(false);
    }
  };

  const getTotalDuration = () => {
    return (
      course?.lessons.reduce((total, lesson) => total + lesson.duration, 0) || 0
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Course Not Found
        </h2>
        <p className="mb-6 text-gray-600">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/courses"
          className="px-6 py-2 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="w-full h-64 overflow-hidden rounded-xl">
          <img
            src={course?.image}
            alt={course?.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center mb-2 space-x-2">
            <span className="px-3 py-1 text-sm font-medium bg-indigo-600 rounded-full">
              {course?.language}
            </span>
            <span className="px-3 py-1 text-sm font-medium bg-gray-700 rounded-full">
              {course?.level}
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold">{course?.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-1 text-yellow-400" />
              <span>{course?.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-1" />
              <span>{course?.lessons.length} lessons</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-1" />
              <span>
                {Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}
                m
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* About This Course */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">About This Course</h2>
            <p className="mb-6 text-gray-700">{course?.description}</p>

            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              {[
                { label: "Instructor", value: course?.createdBy.name },
                { label: "Language", value: course?.language },
                { label: "Level", value: course?.level },
                {
                  label: "Students Enrolled",
                  value: course?.enrolledStudents?.toLocaleString(),
                },
              ].map((info, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <p className="text-sm text-gray-500">{info.label}</p>
                  <p className="font-medium">{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Course Content</h2>
            <p className="mb-4 text-gray-700">
              {course?.lessons.length} lessons •{" "}
              {Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m
              total length
            </p>

            <div className="space-y-4">
              {" "}
              {/* Increased spacing between lessons */}
              {course?.lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className={`flex justify-between items-center p-5 rounded-lg transition-all duration-200 shadow-sm border ${
                    completedLessons.includes(lesson._id)
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                >
                  {/* Lesson Info */}
                  <div className="flex items-center space-x-4">
                    <span
                      className={`flex items-center justify-center w-10 h-10 text-sm font-semibold rounded-full ${
                        completedLessons.includes(lesson._id)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {lesson.order}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium">{lesson.title}</h3>{" "}
                      {/* Bigger text */}
                      <p className="text-sm text-gray-500">
                        {lesson.duration} min
                      </p>
                    </div>
                  </div>

                  {/* Lesson Action */}
                  {course?.isEnrolled ||
                  user?.role === "teacher" ||
                  user?.role === "admin" ? (
                    <Link
                      to={`/dashboard/lesson/${lesson._id}`}
                      className="flex items-center space-x-2 text-sm font-medium text-indigo-600 transition-all hover:text-indigo-800"
                    >
                      <span>View Lesson</span>
                      {completedLessons.includes(lesson._id) &&
                        user?.role === "student" && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                    </Link>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-400 cursor-not-allowed">
                      <Lock className="w-5 h-5" />
                      <span className="text-sm">Locked</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky p-6 top-6">
            {course?.isEnrolled && user?.role === "student" ? (
              <div className="px-8 py-8 bg-white shadow-2xl rounded-2xl">
                <div className="p-4 mb-4 bg-gray-100 rounded-lg">
                  <h3 className="mb-2 text-lg font-semibold">Your Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {progress}% complete
                  </p>
                </div>
                <Link
                  to={`/dashboard/lesson/${course?.lessons[0]._id}`}
                  className="block w-full py-3 mb-4 text-center text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {progress > 0 ? "Continue Learning" : "Start Learning"}
                </Link>

                {user?.role === "student" && (
                  <Link
                    to="/dashboard/discussions"
                    className="flex items-center justify-center w-full py-3 space-x-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Join Discussion</span>
                  </Link>
                )}
              </div>
            ) : (
              user?.role === "student" && (
                <>
                  <h3 className="mb-4 text-xl font-bold">
                    Enroll in this course
                  </h3>
                  <ul className="mb-6 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        Full access to all {course?.lessons.length} lessons
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>10 code examples per lesson</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Quizzes and practice exercises</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="flex items-center justify-center w-full py-3 mb-4 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {enrolling ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        <span>Enrolling...</span>
                      </>
                    ) : (
                      <span>Enroll Now - Free</span>
                    )}
                  </button>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Lock = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default CourseDetails;
