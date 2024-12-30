import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, TextField, Button } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";

import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert components

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  // Fetch user details only when isComments is true
  const getUserDetails = async (userIds) => {
    const userPromises = userIds.map(async (userId) => {
      const response = await fetch(`http://localhost:3001/user/dummy/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      return userData;
    });

    const users = await Promise.all(userPromises);
    console.log(users);
    setUserDetails(users);
  };

  useEffect(() => {
    if (isComments) {
      const userIds = comments.map((comment) => comment.userId);
      getUserDetails(userIds);
    }
  }, [isComments, comments, token]);

  const patchLike = async () => {
    if (loggedInUserId === postUserId) {
      setSnackbarMessage("You cannot like your own post.");
      setOpenSnackbar(true); // Open the Snackbar with the error message
      return; // Prevent the like action
    }

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error in patchLike:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText) return;

    try {
      const response = await fetch("http://localhost:3001/posts/commentupdate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          userId: user._id,
          comment: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setCommentText(""); 
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => {
            const user = userDetails.find(
              (user) => user._id === comment.userId
            );
            return (
              <Box key={`${comment.userId}-${i}`} display="flex" alignItems="center">
                {user && (
                  <img
                    src={`http://localhost:3001/assets/${user.picturePath}`}
                    alt="User"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "0.5rem",
                    }}
                  />
                )}
                <Box>
                  {user && (
                    <Typography sx={{ color: main, fontWeight: "bold" }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                  )}
                  <Typography sx={{ color: main, m: "0.25rem 0" }}>
                    {comment.comment}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <Divider />

          <Box mt="1rem">
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ marginBottom: "0.5rem" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ display: "block", width: "100%" }}
              >
                Post Comment
              </Button>
            </form>
          </Box>
        </Box>
      )}

      {/* Snackbar for error message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </WidgetWrapper>
  );
};

export default PostWidget;
