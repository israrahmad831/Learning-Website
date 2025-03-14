import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Courses from "./pages/courses";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./layout/AdminLayout";
import UserStudent from "./pages/Users/UserStudent";
import UserTeacher from "./pages/Users/UserTeacher";
import TeacherLayout from "./layout/TeacherLayout";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="auth/register" element={<Register />} />
            <Route path="auth/login" element={<Login />} />
          </Route>

          {/* User Dashboard */}
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students/:id" element={<UserStudent />} />
            <Route path="teachers/:id" element={<UserTeacher />} />
          </Route>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
