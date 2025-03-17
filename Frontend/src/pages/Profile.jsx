import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { User, Settings, Award, Mail, Moon, Bell, Trash } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("Mehboob Ali");
  const [email, setEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(localStorage.getItem("notifications") === "true");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const navigate = useNavigate();
  const [completedCourses, setCompletedCourses] = useState([
    { _id: 1, title: "React Mastery", completedAt: "March 5, 2025" },
    { _id: 2, title: "UI/UX Advanced", completedAt: "Feb 20, 2025" },
  ]);
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("notifications", notifications);
  }, [notifications]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={`max-w-3xl mx-auto p-6 transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? "border-gray-700 bg-gray-700" : "border-gray-200 bg-gray-100"} p-3`}>
          {["profile", "settings", "achievements"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : darkMode
                  ? "text-gray-300 hover:text-gray-400"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "profile" && <User className="h-5 w-5" />}
              {tab === "settings" && <Settings className="h-5 w-5" />}
              {tab === "achievements" && <Award className="h-5 w-5" />}
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all flex items-center justify-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Settings</h2>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </div>
                <button
        onClick={() => setDarkMode(!darkMode)}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5" />
                  <span>Email Notifications</span>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 flex items-center rounded-full transition-all ${notifications ? "bg-indigo-600" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${notifications ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {/* Delete Account */}
              <div className="mt-6">
                <button onClick={() => setShowConfirmPopup(true)} className="flex items-center text-red-600 hover:text-red-800 font-medium">
                  <Trash className="h-5 w-5 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {showConfirmPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Confirm Account Deletion</h3>
                <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <button onClick={() => setShowConfirmPopup(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                  <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "achievements" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Achievements</h2>

              <div className="space-y-4">
                {completedCourses.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    You haven't completed any courses yet.
                  </p>
                ) : (
                  completedCourses.map((course) => (
                    <div key={course._id} className="bg-gray-50 p-4 rounded-md flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-700">{course.title}</h4>
                        <p className="text-sm text-gray-500">Completed on {course.completedAt}</p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View Certificate
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
