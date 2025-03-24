import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Code, MessageSquare, Award } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16">
      <section className="p-8 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 text-3xl font-bold md:text-5xl">
            Learn Programming with AI-Powered Lessons
          </h1>
          <p className="mb-8 text-lg md:text-xl">
            Master coding skills with personalized AI-generated lessons,
            interactive examples, and a supportive community.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/courses"
              className="px-6 py-3 font-medium text-indigo-600 transition-colors bg-white rounded-md hover:bg-indigo-100"
            >
              Explore Courses
            </Link>
            {!isAuthenticated && (
              <Link
                to="/auth/register"
                className="px-6 py-3 font-medium transition-colors bg-indigo-700 rounded-md hover:bg-indigo-800"
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto">
        <h2 className="mb-12 text-2xl font-bold text-center md:text-3xl">
          Why Learn With Us?
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-indigo-600 bg-indigo-100 rounded-full">
              <BookOpen size={32} />
            </div>
            <h3 className="mb-2 text-xl font-semibold">AI-Generated Lessons</h3>
            <p className="text-gray-600">
              Personalized learning content created by AI to match your skill
              level and learning pace.
            </p>
          </div>

          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-indigo-600 bg-indigo-100 rounded-full">
              <Code size={32} />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Practical Examples</h3>
            <p className="text-gray-600">
              Each lesson includes 10 code examples to help you understand
              concepts through practice.
            </p>
          </div>

          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-indigo-600 bg-indigo-100 rounded-full">
              <MessageSquare size={32} />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Community Support</h3>
            <p className="text-gray-600">
              Connect with teachers and fellow students through discussions and
              forums.
            </p>
          </div>

          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-indigo-600 bg-indigo-100 rounded-full">
              <Award size={32} />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey with quizzes, tests, and progress
              tracking.
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto">
        <h2 className="mb-8 text-2xl font-bold text-center md:text-3xl">
          Programming Languages You Can Learn
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            "JavaScript",
            "Python",
            "Java",
            "C++",
            "Ruby",
            "Go",
            "PHP",
            "Swift",
            "Rust",
            "TypeScript",
            "C#",
            "Kotlin",
          ].map((language) => (
            <div
              key={language}
              className="p-4 text-center transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
            >
              <p className="font-medium">{language}</p>
            </div>
          ))}
        </div>
      </section>
      {!isAuthenticated && (
        <section className="p-8 text-center bg-gray-100 rounded-xl md:p-12">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Ready to Start Learning?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-700">
            Join thousands of students who are already improving their
            programming skills on our platform.
          </p>
          <Link
            to="/auth/register"
            className="inline-block px-6 py-3 font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Free Account
          </Link>
        </section>
      )}
    </div>
  );
}

export default Home;
