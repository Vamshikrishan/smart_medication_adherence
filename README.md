# 💊 QR‑Based Smart Medication Adherence System

![Project Banner](https://img.shields.io/badge/Project-Smart%20Medication-blueviolet)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![Status](https://img.shields.io/badge/Status-Completed-success)

---

## 🚀 Live Project

🔗 **Frontend (Live Demo):**  
https://medication-frontend-7s2b-git-main-vamshis-projects-3449ccbc.vercel.app?_vercel_share=idIsV0H2pxSSXhK5478wswCsSsFrPHsh

---

## 📌 Overview

The **QR‑Based Smart Medication Adherence System** is a full‑stack healthcare web application designed to help patients take medicines on time and assist pharmacies in generating digital prescriptions using QR codes.

This system minimizes missed doses, improves medication compliance, and provides multilingual voice reminders for patients.

---

## ✨ Key Features

### 🏥 Pharmacy Portal

* Enter patient details
* Add multiple medicines
* Select **exact reminder time (12‑hour clock)**
* Set medicine duration (days)
* Input validation for safety
* Generate unique prescription QR code
* Animated & responsive UI

### 👨‍⚕️ Patient Portal

* Scan QR code using camera
* Automatic prescription retrieval
* Smart reminder engine
* Voice reminders in:

  * 🇬🇧 English
  * 🇮🇳 Hindi
  * 🇮🇳 Telugu
* Repeating alerts until stopped
* Visual alert panel
* Medicine reminders only for prescribed duration

---

## 🎯 Problem Statement

Many patients forget to take medicines on time, especially elderly people. Paper prescriptions can be lost, and manual reminders are unreliable.

This system provides:

* Digital prescriptions
* QR‑based access
* Automatic reminders
* Multilingual voice support

---

## 🧠 System Architecture

```
Pharmacy Portal (React)
        ↓
 Backend API (Node + Express)
        ↓
 MongoDB Atlas
        ↓
 Patient Portal (QR Scan)
```

---

## 🛠️ Technologies Used

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript (ES6+)
* Framer Motion (animations)
* HTML5 QR Scanner

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* QRCode Generator

### APIs & Browser Features

* Web Speech API
* Notification API
* Camera API

---

## 📂 Project Structure

```
frontend/
 ├── src/
 │   ├── pages/
 │   │   ├── Home.jsx
 │   │   ├── Pharmacy.jsx
 │   │   ├── Patient.jsx
 │   ├── styles/
 │   │   ├── pharmacy.css
 │   ├── App.js
 │   └── index.js

backend/
 ├── index.js
 ├── models/
 ├── package.json

README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/qr-medication-system.git
cd qr-medication-system
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
node index.js
```

Backend will run at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔐 Input Validation Rules

| Field         | Rules                       |
| ------------- | --------------------------- |
| Patient Name  | Alphabets + single dot only |
| Medicine Name | Alphabets + single dot only |
| Mobile Number | Exactly 10 digits           |
| Duration      | 1–99 days only              |
| Empty Fields  | Not allowed                 |

If validation fails, QR generation is blocked.

---

## 🔔 Reminder Logic

* Pharmacy sets reminder time
* System checks current time every 30 seconds
* When time matches:

  * Alert appears
  * Voice reminder starts
  * Repeats every 15 seconds
* Alarm stops only when patient clicks **STOP**
* Automatically stops after prescribed days

---

## 🌐 Multilingual Voice Support

| Language | Voice Code |
| -------- | ---------- |
| English  | en‑IN      |
| Hindi    | hi‑IN      |
| Telugu   | te‑IN      |

> Note: Telugu voice depends on browser support.

---

## 📱 Responsive Design

* Desktop ✔️
* Tablet ✔️
* Mobile ✔️

Fully responsive with animated UI elements.

---

## 🚀 Deployment

### Frontend

* Vercel
* Netlify

### Backend

* Render
* Railway

### Database

* MongoDB Atlas

---

## 📸 Screenshots

### Home Page

* Animated gradient background
* Smooth button transitions

### Pharmacy Portal

* Glassmorphism UI
* Animated form fields
* QR popup animation

### Patient Portal

* Camera QR scanning
* Alert panel
* Voice reminder system

---

## 🔮 Future Enhancements

* SMS reminders
* WhatsApp notifications
* Patient history tracking
* Admin dashboard
* Cloud logging
* Doctor login portal

---

## 👨‍💻 Developed By

**Vamshi Krishna**
AI & ML | Web Development Enthusiast

---

## ⭐ If you like this project

Please ⭐ star the repository and share it.

---

## 📜 License

This project is licensed under the **MIT License**.

---

