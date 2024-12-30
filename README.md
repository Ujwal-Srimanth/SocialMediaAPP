

# Social Media Application

This is a feature-rich social media application developed using **React**, **Redux**, **MongoDB**, **Node.js**, **Express**, and **MUI**. The application provides functionalities like creating accounts, uploading posts, liking posts, managing profiles, adding/removing friends, and more. It also supports both dark mode and light mode themes. Recently, a **basic chat application** feature has been added, allowing users to chat with friends in real time, with **seen** and **delivered** indicators.

## Features

- **User Authentication**: Create an account and securely log in.
- **Post Management**: Upload posts, view posts, and like them.
- **Profile Section**: View and edit your profile.
- **Friend Management**: Add and remove friends.
- **Chat Application**: 
  - Send and receive messages in real time.
  - View **delivered** and **seen** statuses for messages.
- **Theme Options**: Switch between dark mode and light mode.
- **Sponsored Ads**: Display of sponsored advertisements.
- **View Other Profiles**: Explore profiles of other users.

### Upcoming Features

- **Comments**: Add and view comments on posts.
- **Advanced Messaging**: Notifications and multimedia sharing (audio, video, attachments).
- **Public Private Feature**: Public Private Featuring Mimicing Instagram.

## Project Structure

The project is divided into two main folders:

1. **Backend**: Contains the server-side code built with Node.js and Express.
2. **Frontend**: Contains the client-side code built with React and Redux.

## Prerequisites

Make sure you have the following installed:
- **Node.js**: Version 14 or above
- **MongoDB**: Running instance of MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ujwal-Srimanth/SocialMediaAPP.git
   cd SocialMediaAPP
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

## Usage

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   node index.js
   # or
   npm run dev
   ```

3. The backend server will start on `http://localhost:5000` (or the port specified in your configuration).

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Start the React application:
   ```bash
   npm start
   ```

3. The frontend application will start on `http://localhost:3000`.

## Technologies Used

- **Frontend**:
  - React
  - Redux
  - Material-UI (MUI)
- **Backend**:
  - Node.js
  - Express
- **Database**:
  - MongoDB
- **Real-time Communication**:
  - Socket.IO (for chat functionality)

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---
