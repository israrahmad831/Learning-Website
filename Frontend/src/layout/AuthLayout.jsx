import React from 'react'
import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="bg-indigo-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 ">
              <Link to="/" className="flex w-60 items-center space-x-2">
                <BookOpen className="h-8 w-8" />
                <span className="text-xl font-bold">AI Learning Platform</span>
              </Link>
            </div>
          </header>
    
          <main className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </main>
    
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; {new Date().getFullYear()} AI Learning Platform. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )
}

export default AuthLayout