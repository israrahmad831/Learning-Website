import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserTeacher = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeacherByName = async () => {
      try {
        const encodedName = encodeURIComponent(name);
        const response = await fetch(
          `http://localhost:5001/api/admin/users/${encodedName}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Teacher Data:", data);
        setTeacher(data);
      } catch (error) {
        console.error("Error fetching teacher:", error);
        setError("Failed to fetch teacher.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherByName();
  }, [name]);

  const handleApprove = async () => {
    if (!teacher) return;

    try {
      const encodedName = encodeURIComponent(teacher.name);
      const response = await fetch(
        `http://localhost:5001/api/admin/users/approve/${encodedName}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to approve teacher");

      const data = await response.json();
      setTeacher(data.user);
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error("Error approving teacher:", error);
    }
  };

  const handleDelete = async () => {
    if (!teacher) return;

    try {
      const encodedName = encodeURIComponent(teacher.name);
      const response = await fetch(
        `http://localhost:5001/api/admin/users/delete/${encodedName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete teacher");
      navigate("/admin"); // Redirect after delete
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!teacher)
    return <p className="text-center mt-10 text-red-500">Teacher not found.</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Teacher Details</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          Teacher Information
        </h2>
        <div className="p-6">
          <p className="text-lg font-semibold text-gray-800">
            <strong>Name:</strong> {teacher.name}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {teacher.email}
          </p>
          <p
            className={`text-lg font-semibold ${
              teacher.isApproved ? "text-green-600" : "text-red-500"
            }`}
          >
            Status: {teacher.isApproved ? "Approved" : "Pending Approval"}
          </p>
        </div>

        <div className="flex gap-4 ml-6">
          {!teacher.isApproved && (
            <button
              onClick={() => setIsApproveModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Approve Registration
            </button>
          )}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Delete User
          </button>
        </div>
      </div>

      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center border border-black-900 shadow-2xl">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">Confirm Approval</h2>
            <p className="mt-2">
              Are you sure you want to approve <strong>{teacher.name}</strong>?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setIsApproveModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleApprove}
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center border border-black-900 shadow-2xl">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-red-600">
              Confirm Deletion
            </h2>
            <p className="mt-2">
              Are you sure you want to delete <strong>{teacher.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTeacher;
