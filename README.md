# 📚 Learning Website (MERN Stack)

This is a full-featured **Learning Management System (LMS)** built with the **MERN Stack** as a **paid client project**. It supports role-based access for **Students**, **Teachers**, and **Admins**, each with tailored functionalities.

## 🔐 Role-Based Functionality

### 👨‍🎓 Students
- Register & log in securely
- Enroll in courses
- Complete lessons
- Take quizzes
- Earn certificates
- Edit profile
- Provide feedback
- Start discussions  
> **Note**: Students can log in immediately after registration without admin approval.

### 👩‍🏫 Teachers
- Register & log in securely (admin approval required)  
- View assigned courses
- Reply to student discussions
- Edit profile  
> **Note**: Teachers cannot log in until their registration is approved by an admin.

### 👨‍💼 Admins
- Log in securely
- Manage student and teacher accounts
- Moderate and reply to all discussions
- View student feedback
- Edit profile
- Approve or reject teacher registrations  

> **Admin Credentials:**  
> - Email: **Admin@gmail.com**  
> - Password: **admin123**

## 🛠️ Tech Stack

- **MongoDB** – Database
- **Express.js** – Backend framework
- **React.js** – Frontend library
- **Node.js** – Runtime environment
- **JWT** – Authentication
- **Mongoose** – ODM for MongoDB
- **React Router** – Client-side routing

## Team:
## Israr ahmad
Github: israrahmad831
LinkedIn: israrahmad2004

## Mehboob Ali
Github:
LinkedIn: 

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB running locally or in the cloud

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/israrahmad831/Learning-Website.git
cd Learning-Website

# Backend
cd Backend
npm install

# Frontend
cd Frontend
npm install

#.env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

# Start backend
cd Backend
npm run dev

# Start frontend (in a new terminal)
cd Frontend
npm run dev





