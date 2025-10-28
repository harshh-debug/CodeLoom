<h1 align="center">🧵 CodeLoom</h1>

<p align="center">
  <b>A modern platform to learn, practice, and master Data Structures & Algorithms — powered by AI and crafted for coders.</b>
</p>

<p align="center">
  <a href="https://codeloom.vercel.app" target="_blank"><b>🌐 Live Demo</b></a> • 
  <a href="#getting-started"><b>🚀 Get Started</b></a> • 
  <a href="#contributing"><b>🤝 Contribute</b></a>
</p>

---

## 🧩 Introduction

**CodeLoom** is an interactive platform to master **Data Structures and Algorithms (DSA)** through real-world problems, video solutions, and AI-powered mentorship.  
With built-in code execution, adaptive hints, and personalized progress tracking, CodeLoom transforms DSA learning into a smooth, engaging, and intelligent experience.

---

## ⚡ Tech Stack

![Frontend](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge)
![Cache](https://img.shields.io/badge/Cache-Redis-red?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-OpenRouter-purple?style=for-the-badge)
![Auth](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)

### 🧠 Backend
Node.js • Express.js • MongoDB • Redis • JWT

### 💻 Frontend
React • Redux • Tailwind CSS • Shadcn UI • Monaco Editor

### 🤖 AI & Integrations
OpenRouter API • Judge0 • Cloudinary

---

## ✨ Features

- 🧮 **Full DSA Problem Bank:** From easy to hard — detailed and real-world relevant coding problems.  
- 🧠 **AI Mentor:** Get hints, explanations, alternative approaches, and time/space complexity analysis.  
- 💻 **Interactive Code Editor:** Monaco-powered editor with syntax highlighting and smooth UX.  
- 🎥 **Video Editorials:** Problem-specific solutions uploaded by experts.  
- 📈 **Progress Tracking:** Save your attempts, solutions, and stats for continuous growth.  
- 🎨 **Modern UI:** Built using Tailwind CSS and Shadcn UI for a polished, consistent experience.

---

## 🚀 Getting Started

### 🧱 Prerequisites
- Node.js (v16 or later)  
- npm (v8 or later)  
- MongoDB Atlas (or local instance)  
- Cloudinary, Judge0, and OpenRouter API accounts/keys  

---

### 🧩 Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshh-debug/CodeLoom.git
   cd CodeLoom
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

---

### ⚙️ Environment Configuration

Create a `.env` file in the `/backend` folder and add the following:

```env
# Server Configuration
PORT=3000

# Database
DB_CONNECT_STRING="mongodb+srv://<username>:<password>@cluster1.mongodb.net/<dbname>"

# JWT
JWT_SECRET="<your_jwt_secret>"

# Redis Configuration
REDIS_HOST="<your_redis_host>"
REDIS_PORT="<your_redis_port>"
REDIS_PASSWORD="<your_redis_password>"

# Judge0 API Keys (comma-separated if multiple)
JUDGE0_KEYS="<key1>,<key2>,<key3>"

# AI / API Integrations
DEEPSEEK_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_API_KEY="<your_openrouter_api_key>"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="<your_cloud_name>"
CLOUDINARY_API_KEY="<your_cloudinary_api_key>"
CLOUDINARY_API_SECRET="<your_cloudinary_api_secret>"
```

> 📝 Replace placeholder values (`<like_this>`) with your actual credentials.

---

### 🧰 Run the Project

**Start backend server:**
```bash
cd backend
node src/index.js
```

**Start frontend dev server:**
```bash
cd frontend
npm run dev
```

---

## 🧱 Core Modules Overview

### 👤 User & Auth
- Secure JWT-based authentication (Sign Up, Login, Logout)
- Tracks user stats, progress, and submissions

### 🧩 Problem Management
- Browse, filter, and search a rich problem library
- Problem pages show markdown-formatted statements, constraints, and tags

### ⚙️ Submissions & Judge
- Code in multiple languages using Monaco Editor  
- Code evaluation powered by **Judge0 API**

### 🎥 Editorials & Video Solutions
- Watch detailed video editorials uploaded via Cloudinary

### 🤖 AI Learning Assistant
- Topic explanations (beginner → advanced)
- Step-by-step hints, alternative solutions, and complexity analysis
- DSA-only Q&A and code reviews powered by **OpenRouter**

---

## 🤝 Contributing

Contributions are highly appreciated! ❤️  

If you’d like to improve CodeLoom or add new features:

1. **Fork** this repository  
2. **Create** your branch (`git checkout -b feature/amazing-feature`)  
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)  
4. **Push** to your branch (`git push origin feature/amazing-feature`)  
5. **Open a Pull Request** 🎉

> For large changes, open an issue first to discuss your ideas.

---

## 🙏 Acknowledgements

Special thanks to the tools and APIs that power CodeLoom:

- [Judge0](https://judge0.com/) – for code execution and multi-language support  
- [OpenRouter](https://openrouter.ai/) – for AI explanations and chat features  
- [Cloudinary](https://cloudinary.com/) – for hosting and streaming video editorials  
- [Shadcn UI](https://ui.shadcn.com/) – for consistent design components  
- [Tailwind CSS](https://tailwindcss.com/) – for responsive styling

---

## 📜 License

This project is licensed under the **MIT License**.  
You’re free to use, modify, and distribute it with attribution.

---

## 👨‍💻 Author

**Built by [Harsh Joshi](https://github.com/harshh-debug)**  
Driven by curiosity, code, and caffeine ☕  
