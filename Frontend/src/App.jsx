import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
//Student
import Home from "./pages/Home";
import Courses from "./pages/courses";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CourseDetails from "./pages/CoursesDetails";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Discussions from "./pages/Discussions";
import NewDiscussions from "./pages/NewDidsussions";
//Layout
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
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetails />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="auth/register" element={<Register />} />
              <Route path="auth/login" element={<Login />} />
            </Route>

            {/* User Dashboard */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" in element={<Dashboard />} />
              <Route path="/dashboard/lesson/:id" element={<Lesson />} />
              <Route path="/dashboard/quiz/:id" element={<Quiz />} />
              <Route path="discussions" element={<Discussions />} />
              <Route
                path="/discussions/new"
                element={
                  <NewDiscussions
                    courses={["java", "python"]}
                    addDiscussion={Discussions}
                  />
                }
              />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>

            {/* Admin Layout with Nested Dashboard */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="student/:id" element={<UserStudent />} />
              <Route path="teacher/:id" element={<UserTeacher />} />
            </Route>
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherDashboard />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
