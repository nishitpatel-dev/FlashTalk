import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { sampleNotifications } from "../../constants/sampleData";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const Notification = () => {
  const { isLoading, data, error, isError } = useGetNotificationsQuery("");
  const { isNotification } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const [acceptRequest] = useAcceptFriendRequestMutation();

  const friendRequestHandler = async ({ _id, accept }) => {
    try {
      const res = await acceptRequest({ requestId: _id, accept });

      if (res.data?.success) {
        console.log("Socket Here");
        dispatch(setIsNotification(false));
        toast.success(res.data.message);
      } else {
        toast.error(res?.data?.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useErrors([{ isError, error }]);
  return (
    <Dialog
      open={isNotification}
      onClose={() => {
        dispatch(setIsNotification(false));
      }}
    >
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle textAlign={"center"}>Notifications</DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequest?.length > 0 ? (
              data?.allRequest?.map((notification) => (
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
          </>
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
          <Avatar src={sender?.avatar} />

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

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
          >
            <Button onClick={() => handler({ _id, accept: true })}>
              Accept
            </Button>
            <Button
              color={"error"}
              onClick={() => handler({ _id, accept: false })}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </ListItem>
    </>
  );
};

export default Notification;
