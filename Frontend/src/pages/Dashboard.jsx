import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, Award, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        setEnrolledCourses([
          {
            _id: '1',
            title: 'JavaScript Fundamentals',
            language: 'JavaScript',
            progress: 65,
            lastAccessed: '2025-03-15T10:30:00Z'
          }
        ]);

        setRecentLessons([
          {
            _id: '101',
            title: 'Variables and Data Types',
            courseId: '1',
            courseName: 'JavaScript Fundamentals',
            lastAccessed: '2025-03-15T10:30:00Z'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Continue your learning journey where you left off.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 text-indigo-500 mr-2" />
            <h2 className="text-lg font-semibold">Enrolled Courses</h2>
          </div>
          <p className="text-3xl font-bold">{enrolledCourses.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="h-6 w-6 text-indigo-500 mr-2" />
            <h2 className="text-lg font-semibold">Average Progress</h2>
          </div>
          <p className="text-3xl font-bold">
            {enrolledCourses.length > 0 
              ? Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length)
              : 0}%
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-indigo-500 mr-2" />
            <h2 className="text-lg font-semibold">Completed Lessons</h2>
          </div>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>


      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link 
              to="/courses" 
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => (
              <Link 
                key={course._id} 
                to={`/courses/${course._id}`}
                className="block bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{course.language}</p>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{course.progress}% complete</p>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last accessed: {formatDate(course.lastAccessed)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        {recentLessons.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity to show.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentLessons.map(lesson => (
              <Link 
                key={lesson._id} 
                to={`/dashboard/lesson/${lesson._id}`}
                className="block py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.courseName}</p>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(lesson.lastAccessed)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
