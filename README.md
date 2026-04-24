# 🖨️ VNIT Campus Print System

A full-stack web application designed to eliminate long queues at the campus Xerox shop. This app allows students to upload documents, pay via UPI, and track their print status in real-time, while giving the shopkeeper a dedicated dashboard to manage incoming orders.

## ✨ Features

**For Students:**
* **Instant Price Calculation:** Automatically calculates the total cost based on the number of copies and color preferences.
* **Document & Payment Upload:** Upload PDF documents and UPI payment screenshots directly to the server.
* **Unique Pickup Codes:** Generates a unique 4-character code (e.g., `A4X9`) upon successful order submission to prevent name collisions.
* **Real-time Status Tracking:** Students can check if their print is `Pending`, `Ready`, or `Picked Up` using their pickup code.

**For the Shopkeeper:**
* **Live Dashboard:** View all incoming print requests in an organized grid.
* **File Access:** One-click access to open the student's PDF and verify their payment screenshot.
* **Status Management:** One-click buttons to notify students when prints are ready or marked as picked up.
* **Shop Toggle:** Ability to virtually "Close" the shop, which prevents new orders from being submitted.
* **Data Management:** "Clear All Data" functionality to reset the database.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), React Router, standard HTML/CSS.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (via Mongoose).
* **File Storage:** Multer (Local disk storage for PDFs and Images).

## 🚀 Installation & Setup

This project is split into two parts: the React frontend and the Node.js backend. You will need to run two separate terminals to start the app.

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd xerox-backend
npm install
