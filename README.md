# techTinder - Backend

**techTinder** is a developer-focused platform that enables users to connect, chat in real-time, and follow each other.  
This backend repository powers all the core functionalities — authentication, messaging, notifications, payments, and scheduled jobs.

---

## 🚀 Features

- User Authentication & Authorization (JWT-based)
- Real-Time Chat System using WebSockets (Socket.io)
- Follow/Unfollow Functionality
- Notifications System (real-time + scheduled)
- Cron Jobs for:
  - Daily/weekly email digests  
  - Activity reminders
- Payment Integration via Razorpay (Stripe upcoming)
- AWS SES Integration for transactional emails
- MongoDB + Mongoose for database operations
- OpenAI Integration (Upcoming) for AI-powered features

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ORM)  
- **Real-Time:** Socket.io  
- **Scheduling:** Node-Cron  
- **Payments:** Razorpay / Stripe (upcoming)  
- **Emails:** AWS SES  
- **Deployment:** AWS (EC2/S3/SES)  
- **Version Control:** Git + GitHub

---

## 📂 Project Structure

```bash
techTinder-backend/
├── src/
│   ├── config/         # DB, AWS, Razorpay configurations
│   ├── controllers/    # Route controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middlewares/    # Auth, Error handling, etc.
│   ├── services/       # Business logic (email, payments, etc.)
│   ├── utils/          # Helper functions
│   └── server.js       # App entry point
├── .env.example
├── package.json
└── README.md

⚙️ Installation & Setup

Follow the steps below to set up the backend locally 👇

1️⃣ Clone the repository
git clone https://github.com/vinamra05/TechTinder.git
cd techTinder-backend

2️⃣ Install dependencies
npm install

3️⃣ Create a .env file

Create a .env file in the root directory based on .env.example and add your environment variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_region
OPENAI_API_KEY=your_openai_key (optional)

4️⃣ Run the server

For development:

npm run dev


For production:

npm start


Server will start on:

http://localhost:5000

🧰 Available Scripts
Command	Description
npm start	Start the production server
npm run dev	Start server in development mode (with nodemon)
npm run lint	Run ESLint check
npm test	Run test cases (if configured)

☁️ Deployment

Deployed using AWS services:
EC2 – For server hosting
S3 – For static/media storage
SES – For sending transactional emails

🧩 Upcoming Features

AI-assisted developer insights using OpenAI API
Advanced analytics dashboard

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Vinamra
Backend Developer – MERN Stack

Email: your-email@example.com  
LinkedIn: https://linkedin.com/in/yourprofile  
GitHub: https://github.com/your-username
