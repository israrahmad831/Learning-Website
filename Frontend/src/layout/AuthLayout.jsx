import React from "react";
import { Outlet, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="text-white bg-indigo-600 shadow-md">
        <div className="container px-4 py-3 mx-auto">
          <Link to="/" className="flex items-center space-x-2 w-60">
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold">AI Learning Platform</span>
          </Link>
        </div>
      </header>

      <main className="flex items-center justify-center flex-grow p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <footer className="py-10 text-white bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
            <div>
              <h3 className="text-lg font-semibold">About Us</h3>
              <p className="mt-2 text-sm">
                AI Learning Platform provides high-quality courses to enhance
                your skills and knowledge.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-indigo-300">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-300">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-300">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <div className="flex justify-center mt-2 space-x-4 md:justify-start">
                <a href="#" className="hover:text-indigo-300">
                  Facebook
                </a>
                <a href="#" className="hover:text-indigo-300">
                  Twitter
                </a>
                <a href="#" className="hover:text-indigo-300">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-center">
            &copy; {new Date().getFullYear()} Israr Ahmad & Mehboob Ali. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
