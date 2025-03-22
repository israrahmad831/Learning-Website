require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/authDB";
const SECRET_KEY = process.env.JWT_SECRET || "your_super_secret_key";

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: false, // ❌ No need for credentials (cookies)
  })
);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "student",
  },
  isApproved: {
    type: Boolean,
    default: function () {
      return this.role !== "teacher";
    },
  },
});

const User = mongoose.model("User", userSchema);

// Middleware to verify token (without cookies)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from headers

  if (!token)
    return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    req.user = decoded;
    next();
  });
};

// 📝 Register User
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const isApproved = role !== "teacher"; // ✅ Teachers require approval

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved,
    });
    await newUser.save();
    if (role === "teacher") {
      return res.status(201).json({
        message:
          "User registered successfully. Your account is pending approval.",
        isApproved,
      });
    }
    if (isApproved === false) {
      return res.status(201).json({
        message:
          "User registered successfully. Your account is pending approval.",
        isApproved,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      isApproved,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// 🔐 Login User (returns token)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // 🚫 Prevent unapproved teachers from logging in
    if (user.role === "teacher" && !user.isApproved) {
      return res
        .status(403)
        .json({ message: "Your account is pending approval." });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👤 Get Authenticated User (requires token in headers)
app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Auth Check Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👤 Get Users by Role (Admin Only)
app.get("/api/admin/users", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { role } = req.query;
    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const users = await User.find({ role }).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/admin/users/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);

    console.log("Searching for user:", decodedName); // Debugging

    const user = await User.findOne({ name: decodedName });

    if (!user) {
      console.log("User not found in database.");
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/admin/users/approve/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);

    const updatedUser = await User.findOneAndUpdate(
      { name: decodedName },
      { isApproved: true }, // Set isApproved to true
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User approved successfully", user: updatedUser });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/admin/users/delete/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);

    const deletedUser = await User.findOneAndDelete({ name: decodedName });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//lesson data from json file

app.get("/api/lessons/:id", (req, res) => {
  const lessonId = req.params.id;
  const filePath = path.join(__dirname, "lesson.json");
  
  fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
          return res.status(500).json({ error: "Failed to load data" });
      }

      try {
          const lessons = JSON.parse(data);
          const foundLesson = lessons.find(lesson => String(lesson._id) === lessonId);

          if (foundLesson) {
              res.json(foundLesson);
          } else {
              res.status(404).json({ error: "Lesson not found" });
          }
      } catch (parseError) {
          res.status(500).json({ error: "Error parsing JSON data" });
      }
  });
});



// Load courses from JSON file
const courseFilePath = path.join(__dirname, "courseData.json");

const getCourses = () => {
  try {
    if (!fs.existsSync(courseFilePath)) {
      console.error("courseData.json file not found!");
      return [];
    }
    const rawData = fs.readFileSync(courseFilePath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading courseData.json:", error);
    return [];
  }
};

// Get all courses
app.get("/api/courses", (req, res) => {
  try {
    const courses = getCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Get a specific course by ID
app.get("/api/courses/:id", (req, res) => {
  try {
    const courses = getCourses();
    const course = courses.find((c) => c._id === req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
});



// 📌 **Course Progress Schema (MongoDB)**
  const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: String, required: true },
    progress: { type: Number, default: 0 },
    completedLessons: { type: [String], default: [] }, // Store completed lesson IDs
  });

const Progress = mongoose.model("Progress", progressSchema);

// 📌 **Fetch Course Data with User Progress**
app.post("/api/courses/:id", verifyToken, async (req, res) => {
  try {
    const courses = getCourses();
    const course = courses.find((c) => c._id === req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Fetch user progress from MongoDB
    const progress = await Progress.findOne({ userId: req.user.userId, courseId: course._id }) || { progress: 0 };
    course.progress = progress.progress;
    course.isEnrolled = progress.progress > 0;

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// 📌 **Enroll in a Course (MongoDB)**
// 📌 **Enroll in a Course**
app.post("/api/courses/:id/enroll", verifyToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId; // Ensure authenticated user

    // Check if user already has progress for this course
    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({ userId, courseId, progress: 0 });
      await progress.save();
    }

    res.json({ message: "Enrollment successful", isEnrolled: true });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
});


// 📌 **Update Course Progress (MongoDB)**
app.put("/api/courses/:id/progress", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    let progressEntry = await Progress.findOne({ userId: req.user.userId, courseId: id });

    if (!progressEntry) {
      progressEntry = new Progress({ userId: req.user.userId, courseId: id, progress });
    } else {
      progressEntry.progress = progress;
    }

    await progressEntry.save();
    res.json({ message: "Progress updated", progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// Get the total number of enrolled students for a course
app.get("/api/courses/:id/enrolled-students", async (req, res) => {
  try {
    const enrolledCount = await Progress.countDocuments({ courseId: req.params.id });
    res.json({ enrolledStudents: enrolledCount });
  } catch (error) {
    console.error("Error fetching enrolled students count:", error);
    res.status(500).json({ error: "Failed to fetch enrolled students count" });
  }
});
// Fetch course progress for a user
app.get("/api/courses/:id/progress", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const progress = await Progress.findOne({ userId: req.user.userId, courseId: id });

    res.json({
      progress: progress ? progress.progress : 0,
      completedLessons: progress ? progress.completedLessons : [],
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});


app.put("/api/courses/:courseId/complete-lesson", verifyToken, async (req, res) => {
  try {
    const { lessonId } = req.body;
    const { courseId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    if (!lessonId || !courseId) {
      return res.status(400).json({ error: "Missing lessonId or courseId" });
    }

    console.log(`User ${userId} completing lesson ${lessonId} for course ${courseId}`);

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({ userId, courseId, completedLessons: [], progress: 0 });
    }

    // Prevent duplicate marking
    if (progress.completedLessons.includes(lessonId)) {
      return res.json({ success: true, progress: progress.progress });
    }

    progress.completedLessons.push(lessonId);

    // Load lessons from JSON instead of using a MongoDB collection
    const lessonFilePath = path.join(__dirname, "lesson.json");
    let totalLessons = 1; // Default to prevent division by zero

    if (fs.existsSync(lessonFilePath)) {
      const lessonsData = JSON.parse(fs.readFileSync(lessonFilePath, "utf-8"));
      totalLessons = lessonsData.filter((lesson) => String(lesson.courseId) === courseId).length || 1;
    }

    progress.progress = Math.min(
      ((progress.completedLessons.length / totalLessons) * 100).toFixed(2),
      100
    );

    await progress.save();

    res.json({ success: true, progress: progress.progress });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/api/dashboard", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "🚨 Unauthorized: No user ID found" });
    }

    const userId = req.user.userId;

    // Fetch user progress from MongoDB
    const progressRecords = await Progress.find({ userId });

    // Fetch enrolled courses with details
    const enrolledCourses = await Promise.all(
      progressRecords.map(async (progress) => {
        const course = getCourses().find((c) => c._id === progress.courseId);
        return {
          _id: course._id,
          title: course.title,
          language: course.language,
          progress: progress.progress || 0,
          quizCompleted: progress.quizCompleted || false,
        };
      })
    );

    // Calculate completed courses based on quiz completion
    const completedCourses = progressRecords.filter((record) => record.progress === 100).length;

    // Calculate average progress
    const totalProgress = progressRecords.reduce((sum, record) => sum + (record.progress || 0), 0);
    const averageProgress = progressRecords.length ? totalProgress / progressRecords.length : 0;

    // Fetch recent lessons from progress records
    const recentLessons = [];
    for (let record of progressRecords) {
      for (let lessonId of record.completedLessons.slice(-3)) {
        const lessonFilePath = path.join(__dirname, "lesson.json");
        if (fs.existsSync(lessonFilePath)) {
          const lessonsData = JSON.parse(fs.readFileSync(lessonFilePath, "utf-8"));
          const lesson = lessonsData.find((l) => String(l._id) === lessonId);
          if (lesson) {
            recentLessons.push({
              _id: lesson._id,
              title: lesson.title,
              courseId: record.courseId,
              courseName: enrolledCourses.find((c) => c._id === record.courseId)?.title || "Unknown Course",
              lastAccessed: new Date().toISOString(),
            });
          }
        }
      }
    }

    res.json({
      enrolledCourses,
      averageProgress,
      completedCourses,
      recentLessons, // ✅ Added recent lessons
    });
  } catch (error) {
    console.error("🚨 Server error in dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  percentage: { type: Number, required: true }
});

const Certificate = mongoose.model("Certificate", certificateSchema);

// Save certificate after passing quiz
app.post("/api/certificates", verifyToken, async (req, res) => {
  try {
    console.log("Received certificate data:", req.body);

    const { studentId, studentName, courseId, courseName, percentage } = req.body;

    if (!studentId || !courseId || !courseName || percentage === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if a certificate already exists
    const existingCertificate = await Certificate.findOne({ studentId, courseId });
    if (existingCertificate) {
      return res.status(409).json({ message: "Certificate already exists for this course" });
    }

    const certificate = new Certificate({ studentId, studentName, courseId, courseName, percentage });
    await certificate.save();

    res.status(201).json({ message: "Certificate saved successfully" });
  } catch (error) {
    console.error("Error saving certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get certificates for a student
app.get("/api/certificates/:studentId", verifyToken, async (req, res) => {
  try {
    console.log("🔍 Checking access:", { tokenUserId: req.user.userId, requestedUserId: req.params.studentId });

    if (req.user.userId !== req.params.studentId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied - Unauthorized user" });
    }

    const certificates = await Certificate.find({ studentId: req.params.studentId });
    res.json(certificates);
  } catch (error) {
    console.error("❌ Error fetching certificates:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Update user profile with password verification
app.put("/api/auth/update", verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.userId;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});







// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


  // Load quizzes from JSON file
const quizFilePath = path.join(__dirname, "quizData.json");

const getQuizzes = () => {
  const rawData = fs.readFileSync(quizFilePath);
  return JSON.parse(rawData);
};

// Get all quizzes
app.get("/api/quizzes", (req, res) => {
  try {
    const quizzes = getQuizzes();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// Get a specific quiz by ID
app.get("/api/quizzes/:id", (req, res) => {
  try {
    const quizzes = getQuizzes();
    const quiz = quizzes.find(q => q._id === req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});
    
    // Feedback Schema
    const feedbackSchema = new mongoose.Schema({
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 }, // ⭐ Include Rating
      createdAt: { type: Date, default: Date.now },
    });
    
    const Feedback = mongoose.model("Feedback", feedbackSchema);
    
    // Submit Feedback
    app.post("/api/feedback", verifyToken, async (req, res) => {
      try {
        if (req.user.role !== "student") {
          return res
            .status(403)
            .json({ message: "Only students can submit feedback" });
        }
    
        const { message, rating } = req.body;
        if (!message || !rating) {
          return res
            .status(400)
            .json({ message: "Message and rating are required" });
        }
    
        const feedback = new Feedback({
          studentId: req.user.userId,
          message,
          rating,
        });
    
        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully" });
      } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    
    // Get All Feedbacks
    app.get("/api/feedback", async (req, res) => {
      try {
        const feedbacks = await Feedback.find()
          .populate("studentId", "name") // Fetch student's name
          .sort({ createdAt: -1 });
    
        res.json(feedbacks);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    
    // Delete Feedback (Only Admins)
    app.delete("/api/feedback/:id", verifyToken, async (req, res) => {
      try {
        if (req.user.role !== "admin") {
          return res
            .status(403)
            .json({ message: "Only admins can delete feedback" });
        }
    
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
          return res.status(404).json({ message: "Feedback not found" });
        }
    
        await Feedback.deleteOne({ _id: req.params.id });
        res.json({ message: "Feedback deleted successfully" });
      } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Server error" });
      }
    });