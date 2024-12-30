import { Box, Typography, useMediaQuery, useTheme, TextField, Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Friend from "../../components/chatFriend";
import WidgetWrapper from "../../components/WidgetWrapper";
import NavBar from "../navBar";
import io from "socket.io-client";
import { use } from "react";

const ChatPage = () => {
  const [friends, setFriends] = useState([]);
  const [recieve,setRecieve] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const token = useSelector((state) => state.token);
  const { _id: userId } = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const socketRef = useRef(null);
  const messageEndRef = useRef(null);

  // Notify server when messages are read
useEffect(() => {
  if (selectedFriend) {
    socketRef.current.emit("messages_read", {
      userId,
      friendId: selectedFriend._id,
    });
  }
}, [selectedFriend]);

useEffect(()=>{
  console.log(messages)
},[messages])



useEffect(() => {
  socketRef.current = io("http://localhost:3001");

  socketRef.current.on("connect", () => {
    console.log("Socket connected", socketRef.current.id);
  });

  socketRef.current.emit("user_connected", userId);

  socketRef.current.on("receive_message", (messageData) => {
    console.log("Message received:", messageData);

    setRecieve(!recieve)

    socketRef.current.emit("message_delivered", {
      conversationId: messageData.conversationId,
      messageId: messageData.messageId,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { ...messageData.newMessage, _id: messageData.messageId },
    ]);
  });

  socketRef.current.on("message_status", ({ messageId, status }) => {
    console.log("Message status update:", messageId, status);
    
    setMessages((prevMessages) =>
      prevMessages.map((msg, index) => {
        const isLastMessage = index === prevMessages.length - 1; // Check if it's the last message
        console.log("hmm", msg._id, "msg", messageId);
    
        if (isLastMessage) {
          console.log(`Last message with ID ${msg._id} status set to "read"`);
          return { ...msg, status: "read" }; // Force status to "read" for the last message
        }
    
        if (msg._id === messageId) {
          if (msg.status === "read") {
            console.log(`Message with ID ${messageId} is already marked as "read"`);
            return msg; // Do not downgrade from "read" to "delivered"
          }
          if (status === "read") {
            console.log(`Message with ID ${messageId} status updated to "read"`);
          }
          return { ...msg, status }; // Update status if not "read"
        }
        return msg;
      })
    );
    
  });
  
  

  return () => {
    socketRef.current.disconnect();
  };
}, []);


  const fetchFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}/friends`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  useEffect(() => {
    if (friends.length > 0) {
      fetchAllMessages();
    }
  }, [friends,recieve]);
  

  const fetchAllMessages = async () => {
    const deliveredMessageCounts = {}; // To store the count of delivered messages for each friend
  
    try {
      // Iterate over all friends
      for (const friend of friends) {
        // Fetch messages for the friend
        const response = await fetch(`http://localhost:3001/conversation/${userId}/${friend._id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
  
        if (data && data.messages) {
          // Count the number of delivered messages
          const deliveredCount = data.messages.filter((msg) => msg.status === "delivered").length;
  
          // Store the count in the map
          deliveredMessageCounts[friend._id] = deliveredCount;
        } else {
          // If no messages, set count to 0
          deliveredMessageCounts[friend._id] = 0;
        }
      }
  
      console.log("Delivered message counts:", deliveredMessageCounts);
  
      // Optionally, update state or perform other actions with the counts
      setUnreadCounts(deliveredMessageCounts);
    } catch (error) {
      console.error("Failed to fetch messages for all friends:", error);
    }
  };
  

  const fetchMessages = async (friendId) => {
    try {
      const response = await fetch(`http://localhost:3001/conversation/${userId}/${friendId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data && data.messages) {
        setMessages(data.messages);
        console.log(data)
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedFriend) {
      const messageData = {
        sender: userId,
        receiver: selectedFriend._id,
        content: message,
        timestamp: new Date().toISOString(),
        status: "delivered",
      };

      socketRef.current.emit("send_message", messageData);

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, status: "delivered" },
      ]);

      setMessage("");
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend._id);
  
      // Update the unread count for the selected friend to 0
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [selectedFriend._id]: 0,
      }));
    }
  }, [selectedFriend]);
  

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <NavBar />

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Friends list */}
        <WidgetWrapper
          sx={{
            width: isMobile ? "100%" : "30%",
            height: "100%",
            overflowY: "auto",
            borderBottom: isMobile ? `1px solid ${theme.palette.neutral.medium}` : "none",
            borderRight: !isMobile ? `1px solid ${theme.palette.neutral.medium}` : "none",
          }}
        >
          <Typography variant="h6" color={theme.palette.neutral.main} mb="1rem">
            Friends
          </Typography>
          {Object.keys(unreadCounts).length === friends.length ? (
  friends.map((friend) => (
    <Friend
      key={friend._id}
      friendId={friend._id}
      name={`${friend.firstName} ${friend.lastName}`}
      userPicturePath={friend.picturePath}
      onClick={() => setSelectedFriend(friend)}
      unreadCount={unreadCounts[friend._id] || 0}
    />
  ))
) : (
  <Typography variant="body2" color={theme.palette.neutral.main} textAlign="center">
    Loading friends...
  </Typography>
)}
        </WidgetWrapper>

        {/* Chat page */}
        <Box
          sx={{
            width: isMobile ? "100%" : "70%",
            height: "100%",
            display: selectedFriend ? "block" : "none",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: theme.palette.background.default,
          }}
        >
          {selectedFriend ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "1rem",
              }}
            >
              {/* Selected friend info */}
              <Box display="flex" alignItems="center" mb="1rem">
                <img
                  src={`http://localhost:3001/assets/${selectedFriend.picturePath}`}
                  alt={`${selectedFriend.firstName} ${selectedFriend.lastName}`}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <Typography variant="h5" color={theme.palette.primary.main}>
                  {selectedFriend.firstName} {selectedFriend.lastName}
                </Typography>
              </Box>

              {/* Chat content */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  paddingBottom: "1rem",
                }}
              >
                {messages && messages.length === 0 ? (
                  <Typography variant="body2" color={theme.palette.neutral.main} textAlign="center">
                    No messages yet. Start the conversation!
                  </Typography>
                ) : (
                  messages.map((msg, index) => (
                    <Box
                    key={msg._id || index || msg.status}
                    sx={{
                      display: "flex",
                      flexDirection: msg.sender === userId ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      mb: "1rem",
                    }}
                  >
                    {/* Message bubble */}
                    <Box
                      sx={{
                        maxWidth: "70%",
                        minWidth: "150px",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        backgroundColor: msg.sender === userId ? theme.palette.primary.main : theme.palette.neutral.light,
                        color: msg.sender === userId ? theme.palette.background.paper : theme.palette.neutral.dark,
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      {/* Message content */}
                      <Typography variant="body1" color="inherit" sx={{ wordBreak: "break-word" }}>
                        {msg.content}
                      </Typography>
                      {/* Timestamp */}
                      <Typography
                        variant="caption"
                        sx={{
                          marginTop: "4px",
                          color: msg.sender === userId ? theme.palette.background.paper : theme.palette.neutral.dark,
                          fontSize: "0.7rem",
                          textAlign: "right",
                          alignSelf: "flex-end",
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                        {msg.sender === userId && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              marginLeft: "0.5rem",
                              color: msg.status === "read" ? theme.palette.background.paper : theme.palette.neutral.dark,
                            }}
                          >
                            {msg.status === "read" ? "✔✔" : "✔"}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  
                  
                  ))
                )}
                <div ref={messageEndRef} />
              </Box>

              {/* Message input area */}
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "1rem",
                  paddingBottom: "1rem",
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{
                    height: "45px",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  sx={{
                    height: "45px",
                    padding: "0 16px",
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          ) : (
            <WidgetWrapper>
              <Typography variant="h6" color={theme.palette.neutral.main}>
                Select a friend to start chatting
              </Typography>
            </WidgetWrapper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
