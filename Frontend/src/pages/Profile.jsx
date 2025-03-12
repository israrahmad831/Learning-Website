import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Key, Award, BookOpen, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          setName(user.name);
          setEmail(user.email);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCompletedCourses([
            {
                _id: '1',
                title: 'JavaScript Fundamentals',
            }
        ]);
        setQuizResults([
         {
            _id: '1',
         }
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Profile updated successfully!');
    setIsUpdating(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsUpdating(false);
  };
  const formatDate = ( string) => {
    const date = new Date(string);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium ${
              activeTab === 'profile'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium ${
              activeTab === 'security'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Key className="h-5 w-5" />
            <span>Security</span>
          </button>
          
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium ${
              activeTab === 'achievements'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="h-5 w-5" />
            <span>Achievements</span>
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <div className="bg-gray-100 p-2 rounded-md">
                      <span className="capitalize">{user?.role}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Profile</span>
                  )}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Change Password</h2>
              
              <form onSubmit={handleChangePassword}>
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {passwordError}
                  </div>
                )}
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters long.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Change Password</span>
                  )}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Your Achievements</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Award className="h-5 w-5 text-indigo-500 mr-2" />
                    <span>Completed Courses</span>
                  </h3>
                  
                  {completedCourses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      You haven't completed any courses yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {completedCourses.map(course => (
                        <div key={course._id} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <p className="text-sm text-gray-500">
                                Completed on {formatDate(course.completedAt)}
                              </p>
                            </div>
                            {course.certificateId && (
                              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View Certificate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                    <span>Quiz Results</span>
                  </h3>
                  
                  {quizResults.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      You haven't taken any quizzes yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quiz
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Score
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {quizResults.map(result => (
                            <tr key={result._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{result.quizTitle}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{result.courseTitle}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{result.score}/{result.totalPoints}</div>
                                <div className="text-sm text-gray-500">{result.percentage}%</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(result.completedAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;