import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";

const NewDiscussion = ({ courses, addDiscussion }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !selectedCourse) {
      setError("All fields are required!");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await addDiscussion({ title, content, courseId: selectedCourse });
      navigate("/dashboard/discussions");
    } catch (error) {
        console.error('Error fetching discussions:', error);
      setError("Failed to create discussion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Discussion</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter discussion title"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write your discussion..."
            rows="5"
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Course</label>
          <select
  value={selectedCourse}
  onChange={(e) => setSelectedCourse(e.target.value)}
  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
  required
>
  <option value="">Select a course</option>
  {Array.isArray(courses) && courses.length > 0 ? (
    courses.map((course) => (
      <option key={course.id} value={course.id}>
        {course}
      </option>
    ))
  ) : (
    <option disabled>No courses available</option>
  )}
</select>

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : <Plus className="h-5 w-5 mr-2" />}
          <span>{isSubmitting ? "Creating..." : "Create Discussion"}</span>
        </button>
      </form>
    </div>
  );
};

export default NewDiscussion;
