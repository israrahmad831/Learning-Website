import React from "react";
import { NavLink, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const TeacherLayout = () => {
  const { user, logout } = useAuth();
  if (!user || user.role !== "teacher") {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 text-white shadow-md bg-gradient-to-r from-indigo-600 to-purple-600">
        <NavLink to="/">
          <h1 className="text-xl font-bold">Home</h1>
        </NavLink>
        <NavLink
          to="/"
          onClick={logout}
          className="flex items-center p-2 text-white bg-blue-600 rounded-lg shadow-lg"
        >
          Logout
        </NavLink>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLayout;
