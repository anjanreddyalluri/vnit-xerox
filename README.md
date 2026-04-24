# 🖨️ VNIT Campus Print System

A full-stack web application designed to eliminate long queues at the campus Xerox shop. This app allows students to upload documents, pay via UPI, and track their print status in real-time, while giving the shopkeeper a dedicated dashboard to manage incoming orders efficiently.

## ✨ Features

**For Students:**
* **Instant Price Calculation:** Automatically calculates the total cost based on the number of copies and color preferences.
* **Document & Payment Upload:** Upload PDF documents and UPI payment screenshots directly to the server.
* **Unique Pickup Codes:** Generates a unique 4-character code (e.g., `A4X9`) upon successful order submission to prevent name collisions.
* **Real-time Status Tracking:** Students can check if their print is `Pending`, `Ready`, or `Picked Up` using their pickup code without waiting in line.

**For the Shopkeeper:**
* **Live Dashboard:** View all incoming print requests in an organized, responsive grid.
* **File Access:** One-click access to open the student's PDF and verify their payment screenshot.
* **Status Management:** One-click buttons to notify students when prints are ready or mark them as picked up.
* **Shop Toggle:** Ability to virtually "Close" the shop (stops accepting new orders) during rush hours or closing time.
* **Data Management:** "Clear All Data" functionality to reset the database and clear the queue.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), React Router, HTML/CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (via Mongoose)
* **File Storage:** Multer (Local disk storage for PDFs and Images)

## 🚀 Installation & Setup

This project is split into two parts: the React frontend and the Node.js backend. You will need to run two separate terminal windows to start the app locally.

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd xerox-backend
npm install
```

Create a `.env` file in the `xerox-backend` directory and add your MongoDB Atlas connection string and port:
```env
MONGO_URI=your_mongodb_atlas_connection_string_here
PORT=5001
```

Start the backend server:
```bash
npm run dev
```
*(The server will run on `http://localhost:5001`)*

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd "VNIT XEROX"
npm install
```

Ensure your UPI QR code is saved as `qr.jpg` inside the `VNIT XEROX/public` folder.

Start the React development server:
```bash
npm run dev
```
*(The app will run on `http://localhost:5173`)*

## 📂 Folder Structure Overview

```text
Xerox/
├── VNIT XEROX/               # React Frontend (Vite)
│   ├── public/               # Static assets (qr.jpg goes here)
│   ├── src/                  # React Components (OrderForm, ShopDashboard, etc.)
│   └── package.json          
└── xerox-backend/            # Node.js Backend
    ├── models/               # Mongoose Database Schemas (Order.js)
    ├── uploads/              # Local storage for uploaded PDFs and Screenshots
    ├── server.js             # Main Express server and API routes
    └── package.json          
```

## 🤝 Author
**Alluri Anjan Reddy** B.Tech ECE, Visvesvaraya National Institute of Technology (VNIT), Nagpur
