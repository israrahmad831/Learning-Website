import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const students = [
      {
        id: 1,
        name: "Israr Ahmad",
        email: "Israrahmad@gmail.com",
        progress: "80%",
        courses: ["JavaScript Fundamentals", "React Basics"],
      },
      {
        id: 2,
        name: "Mehboob Ali",
        email: "Mehboobali@gmail.com",
        progress: "60%",
        courses: ["Next.js Advanced", "Node.js Mastery"],
      },
    ];

    const foundStudent = students.find((s) => s.id === parseInt(id));
    setStudent(foundStudent);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      console.log(`Student ${student.name} deleted`);
      navigate("/admin");
    }
  };

  if (!student) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Details</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white flex items-center rounded-t-lg">
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

        <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white flex items-center rounded-t-lg">
          Enrolled Courses
        </h2>
        <div className="p-6">
          <ul className="list-disc ml-6 text-gray-700">
            {student.courses.map((course, index) => (
              <li key={index} className="py-1">
                {course}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleDelete}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Delete Student
        </button>
      </div>
    </div>
  );
};

export default UserStudent;
