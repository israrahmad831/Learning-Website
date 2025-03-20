require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT;
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

const discussionSchema = new mongoose.Schema({
  user: String,
  question: String,
  responses: [
    {
      responder: String,
      role: String,
      response: String,
    },
  ],
});

const Discussion = mongoose.model("Discussion", discussionSchema);

// Get all discussions
app.get("/api/discussions", async (req, res) => {
  const discussions = await Discussion.find();
  res.json(discussions);
});

// Add a new discussion
app.post("/api/discussions", async (req, res) => {
  const { user, question } = req.body;
  const newDiscussion = new Discussion({ user, question, responses: [] });
  await newDiscussion.save();
  res.status(201).json(newDiscussion);
});

// Delete a discussion (Admin or Post Owner)
app.delete("/api/discussions/:id", async (req, res) => {
  const { id } = req.params;
  const { user, role } = req.body; // User and role must be sent from frontend

  const discussion = await Discussion.findById(id);
  if (!discussion)
    return res.status(404).json({ error: "Discussion not found" });

  if (role === "admin" || discussion.user === user) {
    await Discussion.findByIdAndDelete(id);
    res.json({ message: "Discussion deleted" });
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
});

// Add a reply to a discussion
app.post("/api/discussions/:id/reply", async (req, res) => {
  const { id } = req.params;
  const { responder, role, response } = req.body;

  const discussion = await Discussion.findById(id);
  if (!discussion)
    return res.status(404).json({ error: "Discussion not found" });

  discussion.responses.push({ responder, role, response });
  await discussion.save();
  res.status(201).json(discussion);
});

// Delete a reply (Admin or Reply Owner)
app.delete("/api/discussions/:id/reply/:replyId", async (req, res) => {
  const { id, replyId } = req.params;
  const { user, role } = req.body;

  const discussion = await Discussion.findById(id);
  if (!discussion)
    return res.status(404).json({ error: "Discussion not found" });

  const reply = discussion.responses.find((r) => r._id.toString() === replyId);
  if (!reply) return res.status(404).json({ error: "Reply not found" });

  if (role === "admin" || reply.responder === user) {
    discussion.responses = discussion.responses.filter(
      (r) => r._id.toString() !== replyId
    );
    await discussion.save();
    res.json({ message: "Reply deleted" });
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
});
//teacher reply delete
app.delete(
  "/api/discussions/:discussionId/replies/:replyId",
  async (req, res) => {
    const { discussionId, replyId } = req.params;
    const { user, role } = req.body;

    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion)
        return res.status(404).json({ error: "Discussion not found" });

      const reply = discussion.responses.find(
        (r) => r._id.toString() === replyId
      );
      if (!reply) return res.status(404).json({ error: "Reply not found" });

      // Allow deletion if the user is the reply owner or an admin
      if (role !== "admin" && reply.responder !== user) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this reply" });
      }

      discussion.responses = discussion.responses.filter(
        (r) => r._id.toString() !== replyId
      );
      await discussion.save();
      res.json(discussion);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

//admin delete any reply
app.delete("/api/admin/discussions/:id/replies/:replyId", async (req, res) => {
  const { id, replyId } = req.params;
  const { role } = req.body;

  if (role !== "admin") {
    return res.status(403).json({ error: "Only admins can delete any reply" });
  }

  const discussion = await Discussion.findById(id);
  if (!discussion)
    return res.status(404).json({ error: "Discussion not found" });

  discussion.responses = discussion.responses.filter(
    (r) => r._id.toString() !== replyId
  );
  await discussion.save();
  res.json({ message: "Reply deleted by admin" });
});

app.delete("/api/admin/discussions/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (role !== "admin") {
    return res
      .status(403)
      .json({ error: "Only admins can delete discussions" });
  }

  const discussion = await Discussion.findById(id);
  if (!discussion)
    return res.status(404).json({ error: "Discussion not found" });

  await Discussion.findByIdAndDelete(id);
  res.json({ message: "Discussion deleted by admin" });
});

// Admin deletes any reply
app.delete(
  "/api/admin/discussions/:discussionId/replies/:replyId",
  async (req, res) => {
    const { discussionId, replyId } = req.params;
    const { role } = req.body;

    if (role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete replies" });
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ error: "Discussion not found" });

    discussion.responses = discussion.responses.filter(
      (r) => r._id.toString() !== replyId
    );
    await discussion.save();
    res.json({ message: "Reply deleted by admin" });
  }
);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
