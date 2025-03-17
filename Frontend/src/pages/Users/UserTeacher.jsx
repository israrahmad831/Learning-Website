import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const teachers = [
      {
        id: 1,
        name: "Teacher Jawaad",
        email: "Jawaad@gmail.com",
        subject: "Mathematics",
        approved: false,
      },
      {
        id: 2,
        name: "Teacher Ahmad",
        email: "Ahmad@gmail.com",
        subject: "Physics",
        approved: true,
      },
    ];

    const foundTeacher = teachers.find((t) => t.id === parseInt(id));
    if (foundTeacher) {
      setTeacher(foundTeacher);
      setIsApproved(foundTeacher.approved);
    }
  }, [id]);

  const handleApprove = () => {
    setIsApproved(true);
    alert(`${teacher.name} has been approved as a teacher.`);
  };

  if (!teacher) return <p className="text-center mt-10">Loading...</p>;

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
          <p className="text-gray-600">
            <strong>Subject:</strong> {teacher.subject}
          </p>
          <p
            className={`text-lg font-semibold ${
              isApproved ? "text-green-600" : "text-red-500"
            }`}
          >
            Status: {isApproved ? "Approved" : "Pending Approval"}
          </p>
        </div>

        {!isApproved && (
          <button
            onClick={handleApprove}
            className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Approve Registration
          </button>
        )}
      </div>
    </div>
  );
};

export default UserTeacher;
