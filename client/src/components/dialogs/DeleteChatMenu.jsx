import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteOptionAnchor }) => {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const [deleteChat, _, deletedChatData] = useMutation(useDeleteChatMutation);
  const [leaveGroup, __, leaveGroupData] = useMutation(useLeaveGroupMutation);

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteOptionAnchor.current = null;
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", { id: selectedDeleteChat.chatId });
  };

  const unfriendHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", { id: selectedDeleteChat.chatId });
  };

  useEffect(() => {
    if (deletedChatData?.success || leaveGroupData?.success) {
      navigate("/");
    }
  }, [deletedChatData, leaveGroupData]);

  return (
    <>
      <Menu
        open={isDeleteMenu}
        onClose={closeHandler}
        anchorEl={deleteOptionAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Stack
          sx={{
            width: "10rem",
            padding: "0.5rem",
            cursor: "pointer",
          }}
          direction={"row"}
          alignItems={"center"}
          spacing={"0.5rem"}
          onClick={
            selectedDeleteChat.groupChat ? leaveGroupHandler : unfriendHandler
          }
        >
          {selectedDeleteChat.groupChat ? (
            <>
              <ExitToAppIcon />
              <Typography>Leave Group</Typography>
            </>
          ) : (
            <>
              <DeleteIcon />
              <Typography>Unfriend</Typography>
            </>
          )}
        </Stack>
      </Menu>
    </>
  );
};

export default DeleteChatMenu;
