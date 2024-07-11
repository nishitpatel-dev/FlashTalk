import React, { memo } from "react";
import { LinkComponent } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  name,
  avatar,
  _id,
  groupChat = false,
  sameSender,
  index = 0,
  newMessageAlert,
}) => {
  return (
    <LinkComponent sx={{ padding: "0" }} to={`/chat/${_id}`}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
        }}
      >
        <AvatarCard avatar={avatar} />  
        <Stack>
          <Typography sx={{marginLeft: "10px"}}>{name}</Typography>

          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>

        {/* {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )} */}
      </div>
    </LinkComponent>
  );
};

export default memo(ChatItem);
