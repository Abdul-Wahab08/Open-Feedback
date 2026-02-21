# Open Feedback

Open Feedback is a full-stack anonymous messaging platform built with Next.js, MongoDB, and NextAuth. It allows anyone to send anonymous messages to registered users while maintaining strong authentication, privacy, and AI-powered interaction.

---

## 🚀 Features

### 🔐 Authentication & Security
- User registration with **6-digit email verification**
- Secure password hashing using **bcrypt**
- Login with **Credentials, Google, and GitHub** via NextAuth
- Only verified users can receive messages
- Password change functionality

### 💬 Anonymous Messaging
- Send messages without revealing identity
- Messages stored securely per user
- Users can delete unwanted messages
- Toggle to accept or stop receiving messages

### 📊 User Dashboard
- View all anonymous messages in one place
- Delete messages
- Manage account settings

### 🔎 Smart Username Search
- Search users by unique username
- Debounced search for performance
- Prevents duplicate usernames during registration
- Clicking search result opens public profile

### 🤖 AI Message Suggestions
- AI generates friendly message ideas
- Helps users start conversations
- Powered by **Google Generative AI (Gemini)**

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS

### Backend
- Next.js Route Handlers
- MongoDB with Mongoose
- NextAuth for authentication

### Services
- Resend (email verification)
- Google Generative AI (message suggestions)

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Abdul-Wahab08/open-feedback.git
cd open-feedback
```
### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create .env.local file
## Add the following environment variables:
```bash
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
RESEND_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

### 4️⃣ Run the development server
```bash
npm run dev
```

### 5️⃣ Open in browser
```bash
http://localhost:3000
```
