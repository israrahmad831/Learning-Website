import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserPlus } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Clear old messages

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register(name, email, password, role);

      if (response.success) {
        if (role === "teacher") {
          setSuccessMessage(
            "Registration successful! Your account is pending approval."
          );
        } else {
          setSuccessMessage("Registration successful! Redirecting to login...");
          setTimeout(() => navigate("/auth/login"), 2000); // Redirect after 2s
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
        <p className="text-gray-600">Join our learning platform today</p>
      </div>

      {successMessage && (
        <p className="bg-green-100 text-green-800 border border-green-400 rounded-lg p-3 text-sm text-center w-full mb-2">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="bg-red-100 text-red-800 border border-red-400 rounded-lg p-3 text-sm text-center w-full mb-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            I am a:
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {role === "teacher" && (
            <p className="mt-1 text-sm text-gray-500">
              Note: Teacher accounts require admin approval before activation.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <span>Creating account...</span>
          ) : (
            <>
              <UserPlus className="mr-2 h-5 w-5" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
