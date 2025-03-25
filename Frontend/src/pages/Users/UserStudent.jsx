import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const UserStudent = () => {
  const { name } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    console.log("Using Token in Request:", token); // Debugging

    const fetchStudentData = async () => {
      try {
        const encodedName = encodeURIComponent(name);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token
        };

        console.log("Request Headers:", headers); // Debugging

        const [studentResponse, progressResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/api/admin/users/${encodedName}`, { headers }),
          fetch(
            `${BACKEND_URL}/api/admin/student-progress/student/${encodedName}`,
            { headers }
          ),
        ]);

        if (!studentResponse.ok)
          throw new Error("Failed to fetch student details.");
        if (!progressResponse.ok)
          throw new Error("Failed to fetch student progress.");

        const studentData = await studentResponse.json();
        const progressData = await progressResponse.json();

        setStudent({
          ...studentData,
          averageProgress: progressData.averageProgress || "0%",
        });
      } catch (error) {
        console.error("Error fetching student:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [name]);

  const handleDelete = async () => {
    if (!student) return;

    const token = user?.token || localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is unauthorized.");
      return;
    }

    try {
      const encodedName = encodeURIComponent(student.name);
      const response = await fetch(
        `${BACKEND_URL}/api/admin/users/delete/${encodedName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ensure token is correctly passed
          },
        }
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to delete student: ${errorMsg}`);
      }

      navigate("/admin"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student.");
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (error) return <p className="mt-10 text-center text-red-500">{error}</p>;
  if (!student)
    return <p className="mt-10 text-center text-red-500">Student not found.</p>;

  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Student Details</h1>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        {/* Student Information */}
        <h2 className="p-4 text-lg font-semibold text-white rounded-t-lg bg-gradient-to-r from-indigo-600 to-purple-600">
          Student Information
        </h2>
        <div className="p-6 space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            <strong>Name:</strong> {student.name}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {student.email}
          </p>
          <p className="text-gray-600">
            <strong>Progress:</strong> {student.averageProgress}%
          </p>
        </div>
        {/* Delete Button */}
        <button
          onClick={() => setShowDeletePopup(true)}
          className="px-4 py-2 mt-6 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
        >
          Delete Student
        </button>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mt-2 text-gray-700">
              Are you sure you want to delete <strong>{student.name}</strong>?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 mr-2 text-white transition bg-gray-500 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStudent;
