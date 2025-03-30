import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, BookOpen } from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockCourses = [
          {
            _id: "1",
            title: "JavaScript Fundamentals",
            description:
              "Learn the core concepts of JavaScript programming language.",
            language: "JavaScript",
            level: "Beginner",
            lessons: 12,
            students: 1245,
            rating: 4.7,
            image:
              "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            _id: "2",
            title: "Python for Beginners",
            description:
              "Start your journey with Python, one of the most popular programming languages.",
            language: "Python",
            level: "Beginner",
            lessons: 15,
            students: 2130,
            rating: 4.8,
            image:
              "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            _id: "3",
            title: "Advanced React Patterns",
            description:
              "Master advanced React concepts and patterns for building scalable applications.",
            language: "JavaScript",
            level: "Advanced",
            lessons: 10,
            students: 845,
            rating: 4.9,
            image:
              "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            _id: "4",
            title: "Java Programming Masterclass",
            description:
              "Comprehensive guide to Java programming from basics to advanced topics.",
            language: "Java",
            level: "Intermediate",
            lessons: 20,
            students: 1560,
            rating: 4.6,
            image:
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            _id: "5",
            title: "C++ Fundamentals",
            description:
              "Learn the basics of C++ programming language and object-oriented concepts.",
            language: "C++",
            level: "Beginner",
            lessons: 14,
            students: 980,
            rating: 4.5,
            image:
              "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            _id: "6",
            title: "Data Structures in Python",
            description:
              "Master essential data structures implementation using Python.",
            language: "Python",
            level: "Intermediate",
            lessons: 16,
            students: 1120,
            rating: 4.7,
            image:
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
        ];

        setCourses(mockCourses);

        setFilteredCourses(mockCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let results = courses;

    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLanguage) {
      results = results.filter(
        (course) => course.language === selectedLanguage
      );
    }

    if (selectedLevel) {
      results = results.filter((course) => course.level === selectedLevel);
    }

    setFilteredCourses(results);
  }, [searchTerm, selectedLanguage, selectedLevel, courses]);

  const languages = [...new Set(courses.map((course) => course.language))];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="p-8 text-white bg-indigo-600 rounded-xl">
        <h1 className="mb-4 text-3xl font-bold">Explore Programming Courses</h1>
        <p className="max-w-3xl text-lg">
          Discover a wide range of programming courses designed to help you
          master new skills and advance your career.
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full py-2 pl-3 pr-10 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full py-2 pl-3 pr-10 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold">No courses found</h2>
          <p className="mb-4 text-gray-600">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedLanguage("");
              setSelectedLevel("");
            }}
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded">
                    {course.language}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded">
                    {course.level}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold">{course.title}</h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.lessons} lessons</span>
                  <span>{course.students.toLocaleString()} students</span>
                </div>

                <div className="flex items-center mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(course.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {course.rating.toFixed(1)}
                  </span>
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
