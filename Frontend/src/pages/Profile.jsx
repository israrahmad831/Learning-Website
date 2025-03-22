import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
  User,
  Settings,
  Award,
  Mail,
  Moon,
  Bell,
  Trash,
  Download,
  X,
  Share2,
  Lock,
} from "lucide-react";
import jsPDF from "jspdf";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(" ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") === "true"
  );
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("notifications", notifications);
  }, [notifications]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("🚨 No authentication token found!");
          return;
        }
    
        console.log("📡 Fetching user data...");
        const userResponse = await fetch("http://localhost:5001/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!userResponse.ok) throw new Error("Failed to fetch user data.");
    
        const userData = await userResponse.json();
        const userId = userData._id;
        console.log("✅ Fetched user ID:", userId);
    
        console.log("📡 Fetching certificates for user:", userId);
        const response = await fetch(`http://localhost:5001/api/certificates/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (response.status === 403) {
          console.error("❌ Access denied - Possible token issue");
          throw new Error("❌ Access denied - You may not have permission.");
        }
    
        if (!response.ok) {
          throw new Error(`Failed to fetch certificates - ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("✅ Certificates fetched successfully:", data);
        setCertificates(data);
      } catch (error) {
        console.error("❌ Error fetching certificates:", error);
      }
    };
    
  
    fetchCertificates();
  }, []);
  
  

  const handleDownload = () => {
    const certificateElement = document.getElementById("certificate");
  
    if (!certificateElement) {
      console.error("Certificate element not found!");
      return;
    }
  
    const doc = new jsPDF("p", "mm", "a4"); // A4 portrait PDF
    doc.setFont("helvetica", "bold");
    
    // Add certificate title
    doc.setFontSize(24);
    doc.text("Certificate of Completion", 105, 40, { align: "center" });
  
    // Add student name
    doc.setFontSize(18);
    doc.text(selectedCertificate.studentName, 105, 60, { align: "center" });
  
    // Add course name
    doc.setFontSize(16);
    doc.text(`has successfully completed the course`, 105, 75, { align: "center" });
    doc.text(selectedCertificate.courseName, 105, 90, { align: "center" });
  
    // Add completion date
    doc.setFontSize(14);
    doc.text(`Completion Date: ${new Date(selectedCertificate.date).toLocaleDateString()}`, 105, 110, { align: "center" });
  
    // Add instructor signature line
    doc.setFontSize(12);
    doc.text("_______________________", 40, 150);
    doc.text("Instructor", 40, 160);
  
    // Save as PDF
    doc.save("certificate.pdf");
  };
  
  
  
  
  

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Certificate of Completion",
          text: "I successfully completed my course!",
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    if (!password) {
      alert("Please enter your password to update profile details.");
      setIsUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setName(data.user.name);
      setEmail(data.user.email);
      setPassword("");

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  
  

  const handleDeleteAccount = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-6 transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`rounded-xl shadow-lg overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Tabs */}
        <div
          className={`flex border-b ${
            darkMode
              ? "border-gray-700 bg-gray-700"
              : "border-gray-200 bg-gray-100"
          } p-3`}
        >
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

                <div>
                  <label className="block text-sm font-medium">Enter Password to Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  {isUpdating ? "Updating..." : "Update Profile"}
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
                  className={`w-12 h-6 flex items-center rounded-full transition-all ${
                    notifications ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
                      notifications ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Delete Account */}
              <div className="mt-6">
                <button
                  onClick={() => setShowConfirmPopup(true)}
                  className="flex items-center text-red-600 hover:text-red-800 font-medium"
                >
                  <Trash className="h-5 w-5 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {showConfirmPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">
                  Confirm Account Deletion
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowConfirmPopup(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "achievements" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Your Achievements
              </h2>
              <div className="space-y-4">
                {certificates.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    You haven't completed any courses yet.
                  </p>
                ) : (
                  certificates.map((certificate, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-700">
                        {certificate.courseName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Completed on{" "}
                        {new Date(certificate.date).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => setSelectedCertificate(certificate)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Certificate
                      </button>
                    </div>
                  ))
                )}
              </div>
              {selectedCertificate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div
                    id="certificate"
                    className="bg-white shadow-xl border border-gray-300 p-6 rounded-lg w-full max-w-2xl text-center relative"
                  >
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-indigo-700">
                      Certificate of Completion
                    </h1>
                    <p className="text-lg text-gray-700 mt-2">
                      This is to certify that
                      <span className="block text-2xl font-semibold mt-1">
                        {selectedCertificate.studentName}
                      </span>
                      has successfully completed the course
                    </p>
                    <h2 className="text-xl font-bold text-indigo-600 mt-2">
                      {selectedCertificate.courseName}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      with a passing score of {selectedCertificate.percentage}%.
                    </p>
                    <div className="mt-6 flex justify-between px-8">
                      <div>
                        <p className="border-t border-gray-500 w-40 mx-auto text-gray-700">
                          Instructor
                        </p>
                      </div>
                      <div>
                        <p className="border-t border-gray-500 w-40 mx-auto text-gray-700">
                          Completion Date:{" "}
                          {new Date(
                            selectedCertificate.date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={handleDownload}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
                      >
                        <Download className="h-5 w-5 mr-2" /> Download
                      </button>
                      <button
                        onClick={handleShare}
                        className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700"
                      >
                        <Share2 className="h-5 w-5 mr-2" /> Share
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
