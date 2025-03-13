# 🛒 HAATBAZAR | Fresh Grocery E-commerce

<div align="center">
    <img src="public/logoSideText.png" alt="HAATBAZAR Logo" width="500" />
    <p><i>Fresh farm produce delivered to your doorstep</i></p>
</div>

## 📋 Overview

HAATBAZAR is a modern e-commerce platform specializing in fresh groceries and
produce. Built with Next.js 14 and MongoDB, it offers a seamless shopping
experience with features like user authentication, cart management, wishlist
functionality, and multiple payment options including Khalti integration.

## ✨ Features

- **User Authentication** - Secure sign-up and login
- **Product Browsing** - Browse products by category with sorting and filtering
- **Shopping Cart** - Add, update, and remove items
- **Wishlist** - Save items for future purchase
- **Order Management** - Track order status and history
- **Multiple Payment Methods** - Pay with Khalti, eSewa or cash on delivery
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Toast Notifications** - User-friendly notifications for actions

## 🚀 Tech Stack

<div align="center">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/NextAuth-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="NextAuth" />
    <img src="https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn UI" />
</div>

## 🛠️ Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables
   - Create a `.env.local` file in the root directory with the following:
4. Run the development server
5. Open `http://localhost:3000` in your browser

## 📁 Project Structure

```
haatbazar/
├── public/               # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (pages)/      # Main application pages
│   │   ├── (server)/     # Server actions
│   │   └── api/          # API routes
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── models/           # MongoDB schema models
├── .env.local            # Environment variables
├── next.config.js        # Next.js configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## ⚙️ Key Functionalities

### Authentication

- User registration with email/password
- Social login with Google
- Secure session management

### Product Management

- Comprehensive product details
- Product categorization
- Search functionality

### Cart & Checkout

- Real-time cart updates
- Address management
- Multiple payment options
- Order confirmation

### User Dashboard

- Order history
- Wishlist management
- Profile settings

## 🔒 Security Features

- Protection against CSRF attacks
- Secure authentication with NextAuth.js
- Input validation and sanitization
- Secure storage of user credentials

## 🌐 Deployment

The application is configured for easy deployment on Vercel.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for
details.

<div align="center">
    <p>Made with ❤️ in Nepal</p>
    <p>© 2024 HAATBAZAR. All Rights Reserved.</p>
</div>
