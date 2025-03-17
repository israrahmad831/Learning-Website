import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const AdminLayout = () => {
  const { user, logout } = useAuth();

  // Redirect if not authenticated or not an admin
  if (!user || user.role !== "admin") {
    return <Navigate to="" replace />;
  }
  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Admin</h1>
        <NavLink
          to="/"
          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg flex items-center"
          onClick={logout}
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

export default AdminLayout;
