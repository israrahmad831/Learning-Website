import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Courses from "./pages/courses";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./layout/AdminLayout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>

    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        </Route>
        
        <Route element={<AuthLayout />}>
        <Route path="/auth/register" element={<Register/>} />

        <Route path="/auth/login" element={<Login />} />
</Route>

<Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />            
          </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
