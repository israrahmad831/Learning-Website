import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, Award, Star, MessageSquare, Download } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true); // Start loading
            await new Promise((resolve) => setTimeout(resolve, 1000)); 
        const response = await fetch("/courseData.json"); // Adjust path accordingly
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();

        // Find course by ID or use the default first course
        const selectedCourse = data.find((course) => course._id === String(id));

 if (!selectedCourse) {
                throw new Error("Course not found");
            }

            // Simulate enrollment status
            selectedCourse.isEnrolled = user ? Math.random() > 0.5 : false;

            setCourse(selectedCourse);
        } catch (error) {
            console.error("Error fetching course details:", error);
            setCourse(null); // Ensure state is cleared on error
        } finally {
            setIsLoading(false);
        }
    };

    fetchCourseDetails();
}, [id, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      setEnrolling(true);
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCourse(prev => prev ? { ...prev, isEnrolled: true, progress: 0 } : null);
      
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const getTotalDuration = () => {
    return course?.lessons.reduce((total, lesson) => total + lesson.duration, 0) || 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="h-64 w-full overflow-hidden rounded-xl">
          <img 
            src={course?.image} 
            alt={course?.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium">
              {course?.language}
            </span>
            <span className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium">
              {course?.level}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{course?.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span>{course?.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-1" />
              <span>{course?.lessons.length} lessons</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">About This Course</h2>
            <p className="text-gray-700 mb-6">{course?.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="font-medium">{course?.createdBy.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Language</p>
                <p className="font-medium">{course?.language}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Level</p>
                <p className="font-medium">{course?.level}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Students</p>
                <p className="font-medium">{course?.students.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <p className="text-gray-700 mb-4">
              {course?.lessons.length} lessons • {Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m total length
            </p>
            
            <div className="divide-y divide-gray-200">
              {course?.lessons.map((lesson) => (
                <div key={lesson._id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-start">
                      <span className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                        {lesson?.order}
                      </span>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">{lesson.duration} min</p>
                      </div>
                    </div>
                    
                    {course?.isEnrolled ? (
                      <Link 
                        to={`/dashboard/lesson/${lesson._id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Lesson
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        <Lock className="h-4 w-4 inline" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            {course?.isEnrolled ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${course?.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{course?.progress}% complete</p>
                </div>
                
                <Link 
                  to={`/dashboard/lesson/${course?.lessons[0]._id}`}
                  className="block w-full bg-indigo-600 text-white text-center py-3 rounded-md hover:bg-indigo-700 transition-colors mb-4"
                >
                  Continue Learning
                </Link>
                
                <Link 
                  to="/dashboard/discussions"
                  className="flex items-center justify-center space-x-2 w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Join Discussion</span>
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Enroll in this course</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Full access to all {course?.lessons.length} lessons</span>
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
                  className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors mb-4 flex items-center justify-center"
                >
                  {enrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Enrolling...</span>
                    </>
                  ) : (
                    <span>Enroll Now - Free</span>
                  )}
                </button>
              </>
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