import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Code, MessageSquare, Award } from 'lucide-react'

function Home() {
  return (  
    <div className='space-y-16'>
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Learn Programming with AI-Powered Lessons</h1>
          <p className="text-lg md:text-xl mb-8">
            Master coding skills with personalized AI-generated lessons, interactive examples, and a supportive community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/courses"
              className="bg-white text-indigo-600 hover:bg-indigo-100 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              to="/auth/register"
              className="bg-indigo-700 hover:bg-indigo-800 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Learn With Us?</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Generated Lessons</h3>
            <p className="text-gray-600">
              Personalized learning content created by AI to match your skill level and learning pace.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <Code size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Practical Examples</h3>
            <p className="text-gray-600">
              Each lesson includes 10 code examples to help you understand concepts through practice.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-600">
              Connect with teachers and fellow students through discussions and forums.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey with quizzes, tests, and progress tracking.
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Programming Languages You Can Learn</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'PHP', 'Swift', 'Rust', 'TypeScript', 'C#', 'Kotlin'].map((language) => (
            <div key={language} className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <p className="font-medium">{language}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-100 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Join thousands of students who are already improving their programming skills on our platform.
        </p>
        <Link
          to="/auth/register"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-block"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  )
}

export default Home