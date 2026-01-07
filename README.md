# 🛒 E-Commerce Admin Dashboard (SSR)

A **server-side rendered (SSR) admin dashboard** for managing products in an e-commerce system.  
Built using **Next.js App Router**, **MongoDB**, and **Cloudinary**, this project provides a secure and modern interface for administrators to manage inventory, images, and analytics.

---

Vercel link to access : ecommerce-admin-swart-theta.vercel.app

### Default credentials:
- username: adminn
- password: admin123

## To access:
- Open the vercel link
- Enter the default credentials
- You can now successfully manage and add products on your dashboard!

## 🚀 Features

### 🔐 Admin Authentication
- Database-driven admin login
- Admin-only access to dashboard & inventory
- Secure cookie-based authorization
- Admin onboarding (only admins can create new admins)

### 📦 Product Management (CRUD)
- Create, Read, Update, Delete products
- Mandatory product name, price, and stock
- Stock cannot be negative
- Search products in inventory
- Edit products only via edit button

### 🖼 Image Handling (Cloudinary)
- Upload images **directly from device**
- Optional image upload
- Preview image before saving
- If no image → shows **“No Image”**
- Image updates replace old image in Cloudinary
- Image deletion removes image from Cloudinary
- Fully synced with database

### 📊 Dashboard Analytics
- Total inventory valuation
- Top selling products (chart)
- Critical low-stock alert (Top 3)
- Stock summary list
- Real-time data fetched from backend

### 📈 Charts & Visuals
- Interactive charts using **Recharts**
- Sales analytics
- Stock analytics
- Clean dark UI with Tailwind CSS

### 📄 Export Reports
- Download inventory report as CSV
- Triggered via **Export Report** button
- No UI disruption

---

## 🧰 Tech Stack

| Layer | Technology |
|-----|-----------|
Frontend | Next.js (App Router), React |
Backend | Next.js API Routes |
Database | MongoDB (Mongoose) |
Image Storage | Cloudinary |
Styling | Tailwind CSS |
Charts | Recharts |
Auth | Cookie-based admin auth |
Deployment | Vercel |

---


### Author
- Ujjwal Mishra
- Chemical Engineering
- IIT Roorkee
