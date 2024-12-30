import { Box, Typography, useTheme, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./userImage";

const Friend = ({ friendId, name, userPicturePath, onClick, unreadCount }) => {
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <FlexBetween
      mb="1rem"
      onClick={onClick}
      sx={{
        cursor: "pointer",
        "&:hover": { backgroundColor: primaryLight },
        padding: "0.5rem", // Add padding to avoid content overflow
        borderRadius: "8px", // Optional: for a better hover effect
      }}
    >
      <FlexBetween gap="2rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </Box>
      </FlexBetween>

      {/* Display unread count with a Badge */}
      {unreadCount > 0 && (
        <Badge
          badgeContent={unreadCount}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            "& .MuiBadge-badge": {
              transform: "translate(50%, -50%)", // Adjust badge position
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              fontSize: "0.75rem",
            },
          }}
        />
      )}
    </FlexBetween>
  );
};

export default Friend;
