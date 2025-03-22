import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockCourses = [
            {
            _id: '1',
            title: 'JavaScript Fundamentals',
            description: 'Learn the core concepts of JavaScript programming language.',
            language: 'JavaScript',
            level: 'Beginner',
            lessons: 12,
            students: 1245,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              _id: '2',
              title: 'Python for Beginners',
              description: 'Start your journey with Python, one of the most popular programming languages.',
              language: 'Python',
              level: 'Beginner',
              lessons: 15,
              students: 2130,
              rating: 4.8,
              image: 'https://images.unsplash.com/photo-1624953587687-daf255b6b80a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            {
              _id: '3',
              title: 'Advanced React Patterns',
              description: 'Master advanced React concepts and patterns for building scalable applications.',
              language: 'JavaScript',
              level: 'Advanced',
              lessons: 10,
              students: 845,
              rating: 4.9,
              image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              _id: '4',
              title: 'Java Programming Masterclass',
              description: 'Comprehensive guide to Java programming from basics to advanced topics.',
              language: 'Java',
              level: 'Intermediate',
              lessons: 20,
              students: 1560,
              rating: 4.6,
              image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              _id: '5',
              title: 'C++ Fundamentals',
              description: 'Learn the basics of C++ programming language and object-oriented concepts.',
              language: 'C++',
              level: 'Beginner',
              lessons: 14,
              students: 980,
              rating: 4.5,
              image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              _id: '6',
              title: 'Data Structures in Python',
              description: 'Master essential data structures implementation using Python.',
              language: 'Python',
              level: 'Intermediate',
              lessons: 16,
              students: 1120,
              rating: 4.7,
              image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
        ];

        setCourses(mockCourses);

        setFilteredCourses(mockCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let results = courses;
    
    if (searchTerm) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLanguage) {
      results = results.filter(course => course.language === selectedLanguage);
    }
    
    if (selectedLevel) {
      results = results.filter(course => course.level === selectedLevel);
    }
    
    setFilteredCourses(results);
  }, [searchTerm, selectedLanguage, selectedLevel, courses]);

  const languages = [...new Set(courses.map(course => course.language))];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 text-white rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Explore Programming Courses</h1>
        <p className="text-lg max-w-3xl">
          Discover a wide range of programming courses designed to help you master new skills and advance your career.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Languages</option>
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No courses found</h2>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedLanguage('');
              setSelectedLevel('');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <Link 
            key={course._id} 
            to={`/courses/${course._id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                  {course.language}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                  {course.level}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{course.lessons} lessons</span>
                <span>{course.students.toLocaleString()} students</span>
              </div>
              
              <div className="mt-4 flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{course.rating.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
};

export default Courses;

