import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Search, Filter, Plus, MessageCircle, CheckCircle, Pin, Eye } from 'lucide-react';

const Discussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [filterResolved, setFilterResolved] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call delay
        
        const mockDiscussions = [
          {
            _id: '1',
            title: 'How do closures work in JavaScript?',
            content: 'I\'m having trouble understanding closures in JavaScript. Can someone explain how they work and provide some practical examples?',
            courseId: '1',
            courseName: 'JavaScript Fundamentals',
            lessonId: '107',
            lessonName: 'Functions and Closures',
            author: { _id: 'user1', name: 'Alex Johnson', role: 'student' },
            replies: 3,
            isResolved: true,
            isPinned: true,
            views: 42,
            createdAt: '2025-03-10T14:30:00Z',
            lastActivity: '2025-03-12T09:15:00Z'
          },
          {
            _id: '2',
            title: 'Difference between let, const, and var',
            content: 'Can someone explain the key differences between let, const, and var in JavaScript? When should I use each one?',
            courseId: '1',
            courseName: 'JavaScript Fundamentals',
            lessonId: '101',
            lessonName: 'Variables and Data Types',
            author: { _id: 'user2', name: 'Sarah Miller', role: 'student' },
            replies: 5,
            isResolved: true,
            isPinned: false,
            views: 78,
            createdAt: '2025-03-08T10:45:00Z',
            lastActivity: '2025-03-11T16:20:00Z'
          },
          {
            _id: '3',
            title: 'Error handling in async/await',
            content: 'I\'m trying to implement proper error handling with async/await but I\'m not sure about the best practices. Should I use try/catch blocks or is there a better way?',
            courseId: '1',
            courseName: 'JavaScript Fundamentals',
            lessonId: '110',
            lessonName: 'Asynchronous JavaScript',
            author: { _id: 'user3', name: 'Michael Chen', role: 'student' },
            replies: 2,
            isResolved: false,
            isPinned: false,
            views: 31,
            createdAt: '2025-03-14T08:20:00Z',
            lastActivity: '2025-03-14T15:45:00Z'
          }
        ];
        
        setDiscussions(mockDiscussions);
        setFilteredDiscussions(mockDiscussions);
      } catch (error) {
        console.error('Error fetching discussions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  useEffect(() => {
    let results = [...discussions];

    // Search filter
    if (searchTerm) {
      results = results.filter(discussion =>
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Course filter
    if (selectedCourse) {
      results = results.filter(discussion => discussion.courseId === selectedCourse);
    }

    // Resolved filter
    if (filterResolved !== null) {
      results = results.filter(discussion => discussion.isResolved === filterResolved);
    }

    // Sorting
    results.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      }
      if (sortBy === 'popular') {
        return b.views - a.views;
      }
      if (sortBy === 'unanswered') {
        return a.replies - b.replies;
      }
      return 0;
    });

    // Always keep pinned discussions at the top
    results.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    setFilteredDiscussions(results);
  }, [discussions, searchTerm, selectedCourse, filterResolved, sortBy]);

  const courses = [...new Set(discussions.map(d => d.courseId))].map(courseId => ({
    id: courseId,
    name: discussions.find(d => d.courseId === courseId)?.courseName || ''
  }));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Discussions</h1>
          {user && <p>Welcome, {user.name}!</p>}
          <p className="text-gray-600">Ask questions and participate in discussions with teachers and other students.</p>
        </div>
        <Link
          to="/discussions/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center md:justify-start"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>New Discussion</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={filterResolved === null ? '' : filterResolved ? 'resolved' : 'unresolved'}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setFilterResolved(null);
                  } else {
                    setFilterResolved(e.target.value === 'resolved');
                  }
                }}
                className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="resolved">Resolved</option>
                <option value="unresolved">Unresolved</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Viewed</option>
                <option value="unanswered">Unanswered</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discussions List */}
      {filteredDiscussions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No discussions found</h2>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCourse('');
              setFilterResolved(null);
              setSortBy('recent');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredDiscussions.map(discussion => (
              <Link 
                key={discussion._id} 
                to={`/dashboard/discussions/${discussion._id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {discussion.isPinned && (
                          <span className="mr-2 text-gray-500">
                            <Pin className="h-4 w-4" />
                          </span>
                        )}
                        <h3 className="font-semibold text-lg">{discussion.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{discussion.content}</p>
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                          {discussion.courseName}
                        </span>
                        {discussion.lessonName && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            {discussion.lessonName}
                          </span>
                        )}
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {discussion.replies} {discussion.replies === 1 ? 'reply' : 'replies'}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {discussion.views} views
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col items-end">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 mr-2">
                          {formatDate(discussion.lastActivity)}
                        </span>
                        {discussion.isResolved ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            Open
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 mr-1">by</span>
                        <span className="font-medium">{discussion.author.name}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          discussion.author.role === 'teacher' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : discussion.author.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {discussion.author.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;