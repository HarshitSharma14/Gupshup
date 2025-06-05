# 💬 ChatApp MERN

A modern, real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring instant messaging, user authentication, and a responsive design.

![Chat Application](https://img.shields.io/badge/MERN-Stack-green)
![Real Time](https://img.shields.io/badge/Real--Time-Socket.io-blue)
![Authentication](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- **Real-time Messaging** - Instant message delivery using Socket.io
- **User Authentication** - Secure login/registration with JWT tokens
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Online Status** - See who's currently online
- **Message History** - Persistent chat history stored in MongoDB
- **User-friendly Interface** - Clean and intuitive chat interface
- **Typing Indicators** - See when someone is typing
- **Emoji Support** - Express yourself with emojis
- **Private Messaging** - One-on-one conversations
- **Group Chats** - Create and join group conversations

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Router** - Navigation and routing
- **CSS3/Styled Components** - Styling and animations

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshitSharma14/chatappMERN.git
   cd chatappMERN
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB service
   sudo service mongod start
   ```

6. **Run the application**
   
   Start the server (from server directory):
   ```bash
   npm run dev
   ```
   
   Start the client (from client directory):
   ```bash
   npm start
   ```

7. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
chatappMERN/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # Context providers
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS files
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── socket/             # Socket.io configuration
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
└── README.md
```

## 🔧 Configuration

### Database Configuration

**Local MongoDB:**
```javascript
MONGODB_URI=mongodb://localhost:27017/chatapp
```

**MongoDB Atlas:**
```javascript
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
```

### JWT Configuration

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📱 Usage

1. **Register/Login** - Create a new account or login with existing credentials
2. **Start Chatting** - Join existing conversations or start new ones
3. **Real-time Updates** - Messages appear instantly for all connected users
4. **Online Status** - See who's currently active
5. **Message History** - Scroll up to view previous messages

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Messages
- `GET /api/messages` - Get chat messages
- `POST /api/messages` - Send new message
- `DELETE /api/messages/:id` - Delete message

### Users
- `GET /api/users` - Get all users
- `GET /api/users/online` - Get online users
- `PUT /api/users/profile` - Update user profile

## 🔥 Socket Events

### Client Events
- `join` - Join a chat room
- `sendMessage` - Send a message
- `typing` - User is typing
- `stopTyping` - User stopped typing

### Server Events
- `newMessage` - New message received
- `userOnline` - User came online
- `userOffline` - User went offline
- `typing` - Someone is typing
- `stopTyping` - Stopped typing

## 🎨 Screenshots

*Add screenshots of your application here to showcase the UI*

## 🚧 Roadmap

- [ ] File sharing capabilities
- [ ] Voice messages
- [ ] Video calling integration
- [ ] Message reactions
- [ ] Dark/Light theme toggle
- [ ] Message search functionality
- [ ] Push notifications
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Harshit Sharma**
- GitHub: [@HarshitSharma14](https://github.com/HarshitSharma14)
- LinkedIn: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- Socket.io for real-time communication
- MongoDB for database solutions
- React community for amazing libraries
- All contributors who help improve this project

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or reach out directly.

---

⭐ **Star this repository if you found it helpful!**
