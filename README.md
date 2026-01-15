# E-Commerce Web Application

### Full-Stack E-Commerce Platform (Frontend + Backend + Admin Panel)

---

## About the Project

This is a **full-stack E-Commerce web application** built to simulate a real-world online shopping platform.
It includes a **frontend for users**, a **backend REST API**, and an **admin dashboard** for managing products and orders.

The project demonstrates:
- Real-world full-stack development
- Secure authentication
- Clean backend architecture
- Scalable code structure

---

## System Architecture

Frontend / Admin Panel  
↓  
Backend REST API  
↓  
MongoDB Database  

---

## Project Structure

E-Commerce/  
├── frontend/ – User-facing application  
├── backend/ – Server, APIs, authentication  
├── admin/ – Admin dashboard  
├── .gitignore  
├── README.md  
└── LICENSE  

---

## Features

### User Features
- User signup and login  
- JWT-based authentication  
- Browse products  
- View product details  
- Add & remove items from cart  
- Place orders  
- Responsive UI  

### Admin Features
- Admin authentication  
- Add products  
- Update products  
- Delete products  
- Manage inventory  
- View all orders  

### Technical Features
- RESTful APIs  
- JWT authentication  
- Secure password hashing  
- Environment-based config  
- Modular backend structure  

---

## Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
- React  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

### Authentication
- JSON Web Tokens (JWT)  
- bcrypt  

### Tools
- Git & GitHub  
- npm  
- Postman  
- VS Code  

---

## Installation & Setup

### Prerequisites
- Node.js  
- npm  
- MongoDB  

---

### Clone Repository

git clone https://github.com/RealCifer/E-Commerce.git  
cd E-Commerce  

---

### Backend Setup

cd backend  
npm install  

Create `.env` file:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret  

Start backend:

npm start  

Backend runs on:  
http://localhost:5000  

---

### Frontend Setup

cd frontend  
npm install  
npm start  

Frontend runs on:  
http://localhost:3000  

---

### Admin Panel Setup

cd admin  
npm install  
npm start  

Admin panel runs on:  
http://localhost:3001  

---

## Authentication Flow

Login → JWT Generated → Stored on Client → Sent in Headers → Access Protected Routes  

---

## 📡 API Endpoints

Authentication  
POST /api/auth/register  
POST /api/auth/login  

Products  
GET /api/products  
GET /api/products/:id  
POST /api/products (Admin)  
PUT /api/products/:id (Admin)  
DELETE /api/products/:id (Admin)  

Cart & Orders  
POST /api/cart  
POST /api/order  
GET /api/orders  

---

## Deployment

Frontend: Vercel / Netlify  
Backend: Render / Railway / AWS  
Database: MongoDB Atlas  

---

## Contributing

1. Fork the repo  
2. Create a new branch  
3. Make changes  
4. Commit & push  
5. Open a PR  

---

## Author

Aditya Khamait  
GitHub: https://github.com/RealCifer  
---
