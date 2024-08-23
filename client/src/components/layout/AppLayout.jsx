import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useErrors } from "../../hooks/hook";
import { useGetMyChatsQuery } from "../../redux/api/api";
import {
  setIsDeleteMenu,
  setIsMobileMenu,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import {
  incrementNotificationCount,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = (OldComponent) => {
  return () => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const socket = getSocket();

    const navigate = useNavigate();

    const { isMobileMenu } = useSelector((state) => state.misc);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useGetMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, _id, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId: _id, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileMenuClose = () => {
      dispatch(setIsMobileMenu(false));
    };

    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotificationCount());
    }, []);

    const newMessageAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;

        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const refetchHandler = useCallback(() => {
      refetch();
      navigate("/");
    }, []);

    const onlineUsersHandler = useCallback(
      (data) => {
        setOnlineUsers(data);
      },
      [onlineUsers]
    );

    useEffect(() => {
      socket.on(NEW_REQUEST, newRequestHandler);
      socket.on(NEW_MESSAGE_ALERT, newMessageAlertHandler);
      socket.on(REFETCH_CHATS, refetchHandler);
      socket.on(ONLINE_USERS, onlineUsersHandler);

      return () => {
        socket.off(NEW_REQUEST, newRequestHandler);
        socket.off(NEW_MESSAGE_ALERT, newMessageAlertHandler);
        socket.off(REFETCH_CHATS, refetchHandler);
        socket.off(ONLINE_USERS, onlineUsersHandler);
      };
    }, [chatId]);

    return (
      <>
        <Title />
        <Header />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteOptionAnchor={deleteMenuAnchor.current}
        />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobileMenu} onClose={handleMobileMenuClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <OldComponent chatId={chatId} />
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile />
          </Grid>
        </Grid>

        {/* <p>Footer</p> */}
      </>
    );
  };
};

export default AppLayout;
