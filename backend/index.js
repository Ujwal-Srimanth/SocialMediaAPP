import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// Import socket.io
import { Server } from "socket.io";
import Conversation from "./models/Chat.js"; // Import the Conversation model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
  })
);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Define routes
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/auth/register", upload.single("picture"), register);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.get("/conversation/:userId/:friendId", verifyToken, async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    // Check if both userId and friendId are different
    if (userId === friendId) {
      return res.status(400).json({ message: "Cannot fetch conversation with yourself" });
    }

    // Find the conversation between the two users
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Return the messages in the conversation
    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch conversation", error });
  }
});



// Create the HTTP server
const server = app.listen(process.env.PORT || 6001, () => {
  console.log(`Server is running on port ${process.env.PORT || 6001}`);
});

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from the React frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let activeUsers = {}; // Keep track of active users

// Socket.IO connection handler
// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    // Store the user's socket ID
    socket.on("user_connected", (userId) => {
      activeUsers[userId] = socket.id;
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  
      // Send the user's conversations upon connection
      Conversation.find({ participants: userId })
        .then((conversations) => {
          socket.emit("conversations", conversations); // Send conversations to the client
        })
        .catch((error) => console.error("Error fetching conversations:", error));
    });

   
  
    // Handle sending messages
    // Emit "message_read" if receiver is active
    socket.on("send_message", async ({ sender, receiver, content }) => {
      try {
        let conversation = await Conversation.findOne({
          participants: { $all: [sender, receiver] },
        });
    
        if (!conversation) {
          conversation = new Conversation({
            participants: [sender, receiver],
            messages: [],
          });
        }
    
        const newMessage = {
          sender,
          content,
          status: activeUsers[receiver] ? "read" : "delivered",
          timestamp: new Date(),
        };
    
        // Push the new message and save the conversation
        conversation.messages.push(newMessage);
        await conversation.save();
    
        // Retrieve the last saved message (to get its _id)
        const savedMessage = conversation.messages[conversation.messages.length - 1];
    
        if (activeUsers[receiver]) {
          io.to(activeUsers[receiver]).emit("receive_message", {
            newMessage: savedMessage,
            conversationId: conversation._id,
            messageId: savedMessage._id,
          });
    
          io.to(activeUsers[sender]).emit("message_status", {
            messageId: savedMessage._id,
            status: "read",
          });
        } 
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
    

// Mark all delivered messages as read when the receiver opens the chat
socket.on("messages_read", async ({ userId, friendId }) => {
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (conversation) {
      const updatedMessages = conversation.messages.map((msg) => {
        if (msg.status === "delivered" && msg.sender.toString() === friendId) {
          msg.status = "read";
        }
        return msg;
      });

      await conversation.save();

      // Notify the sender about the status change
      updatedMessages.forEach((msg) => {
        if (msg.status === "read") {
          io.to(activeUsers[friendId]).emit("message_status", {
            messageId: msg._id,
            status: "read",
          });
        }
      });
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
});

    // Handle message delivery status update
    socket.on("message_delivered", async ({ conversationId, messageId }) => {
      try {
        console.log(`Message delivered event received: conversationId=${conversationId}, messageId=${messageId}`);
        
        const conversation = await Conversation.findById(conversationId);
        const message = conversation.messages.id(messageId);
  
        if (message && message.status !== "delivered") {
          message.status = "delivered"; // Update the status to "delivered"
          await conversation.save();
  
          // Emit the updated message status to the sender
          console.log(`Message ${messageId} status updated to delivered`);
          io.to(activeUsers[message.sender.toString()]).emit("message_status", {
            messageId,
            status: "delivered",
          });

           
        }
      } catch (error) {
        console.error("Error updating message status:", error);
      }
    });
  
    // Handle message seen status update
    socket.on("message_seen", async ({ conversationId, messageId, userId }) => {
      try {
        console.log(`Message seen event received: conversationId=${conversationId}, messageId=${messageId}, userId=${userId}`);
        
        const conversation = await Conversation.findById(conversationId);
        const message = conversation.messages.id(messageId);
  
        if (message && !message.readBy.includes(userId)) {
          message.status = "seen"; // Update the status to "seen"
          message.readBy.push(userId); // Add the user to the "readBy" array
          await conversation.save();
  
          // Emit the updated message status to the sender
          console.log(`Message ${messageId} status updated to seen`);
          io.to(activeUsers[message.sender.toString()]).emit("message_status", {
            messageId,
            status: "seen",
          });
        }
      } catch (error) {
        console.error("Error updating message status:", error);
      }
    });
  
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      // Remove the user from active users when they disconnect
      for (const userId in activeUsers) {
        if (activeUsers[userId] === socket.id) {
          delete activeUsers[userId];
          break;
        }
      }
    });
  });
  

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log(`MongoDB connection failed: ${err}`);
  });
