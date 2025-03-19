import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserStudent = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false); // Delete confirmation popup state

  useEffect(() => {
    const fetchStudentByName = async () => {
      try {
        const encodedName = encodeURIComponent(name);
        const response = await fetch(
          `http://localhost:5001/api/admin/users/${encodedName}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
        setError("Failed to fetch student.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentByName();
  }, [name]);

  const handleDelete = async () => {
    if (!student) return;

    try {
      const encodedName = encodeURIComponent(student.name);
      const response = await fetch(
        `http://localhost:5001/api/admin/users/delete/${encodedName}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student.");
      }

      navigate("/admin"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!student)
    return <p className="text-center mt-10 text-red-500">Student not found.</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Details</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          Student Information
        </h2>
        <div className="p-6">
          <p className="text-lg font-semibold text-gray-800">
            <strong>Name:</strong> {student.name}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {student.email}
          </p>
          <p className="text-gray-600">
            <strong>Progress:</strong> {student.progress}
          </p>
        </div>

        <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          Enrolled Courses
        </h2>
        <div className="p-6">
          <ul className="list-disc ml-6 text-gray-700">
            {(student.courses || []).map((course, index) => (
              <li key={index} className="py-1">
                {course}
              </li>
            ))}
          </ul>
        </div>

        {/* Delete Confirmation Popup Button */}
        <button
          onClick={() => setShowDeletePopup(true)}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Delete Student
        </button>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center border border-black-900 shadow-2xl">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mt-2 text-gray-700">
              Are you sure you want to delete <strong>{student.name}</strong>?
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  handleDelete();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
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
