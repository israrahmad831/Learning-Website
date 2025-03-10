import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Courses from "./pages/courses";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Dashboard from "./pages/Dashboard";

import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

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
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
export default App;
