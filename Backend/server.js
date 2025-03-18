require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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


// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
