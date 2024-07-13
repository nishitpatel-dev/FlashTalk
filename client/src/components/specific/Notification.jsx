import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import { sampleNotifications } from "../../constants/sampleData";

const Notification = () => {
  const friendRequestHandler = ({_id, accept}) => {
    console.log({_id, accept});
  };

  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle textAlign={"center"}>Notifications</DialogTitle>

        {sampleNotifications.length > 0 ? (
          sampleNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              sender={notification.sender}
              _id={notification._id}
              handler={friendRequestHandler}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>0 Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = ({ sender, _id, handler }) => {
  return (
    <>
      <ListItem>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"1rem"}
          width={"100%"}
        >
          <Avatar />

          <Typography
            variant={"body1"}
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {`${sender.name} sent you a friend request.`}
          </Typography>

          <Stack direction={{
            xs: "column",
            sm: "row"
          }}>
            <Button onClick={() => handler({ _id, accept: true })}>
              Accept
            </Button>
            <Button color={"error"} onClick={() => handler({ _id, accept: false })}>
              Reject
            </Button>
          </Stack>
        </Stack>
      </ListItem>
    </>
  );
};

export default Notification;
