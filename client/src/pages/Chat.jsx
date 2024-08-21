import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { grayColor, orange } from "../constants/color";
import { NEW_MESSAGE } from "../constants/events";
import { useErrors } from "../hooks/hook";
import { useChatDetailsQuery, useGetMyMessagesQuery } from "../redux/api/api";
import { getSocket } from "../socket";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeMessagesAlert } from "../redux/reducers/chat";

const Chat = ({ chatId }) => {
  const containerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);

  const dispatch = useDispatch();

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const messagesInChunk = useGetMyMessagesQuery({ chatId, page });

  const handleAllMessages = () => {
    if (messagesInChunk?.data?.messages) {
      setAllMessages((prev) => [...messagesInChunk.data.messages, ...prev]);
      setInitialLoad(true);
      setScrollHeight(containerRef?.current?.scrollHeight);
    }
  };

  const members = chatDetails?.data?.chat?.members;

  const errors = [
    // { isError: chatDetails?.isError, error: chatDetails?.error },
    { isError: messagesInChunk?.isError, error: messagesInChunk?.error },
  ];

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));

    setFileMenuAnchorEl(e.currentTarget);
  };

  const sendMessageHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    dispatch(removeMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setAllMessages([]);
      setPage(null);
      setScrollHeight(0);
    };
  }, [chatId]);

  const newMessageHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  useEffect(() => {
    socket.on(NEW_MESSAGE, newMessageHandler);

    return () => {
      socket.off(NEW_MESSAGE, newMessageHandler);
    };
  }, [chatId]);

  useErrors(errors);

  useEffect(() => {
    handleAllMessages();
  }, [messagesInChunk.data]);

  useEffect(() => {
    const handleScroll = () => {
      try {
        if (containerRef.current.scrollTop === 0) {
          setPage((prev) => prev + 1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    containerRef?.current?.addEventListener("scroll", handleScroll);

    return () => {
      containerRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, [messagesInChunk.isLoading]);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;
    }
  }, [initialLoad, messages]);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - scrollHeight;
    }
  }, [scrollHeight]);

  return messagesInChunk.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((message) => (
          <MessageComponent message={message} user={user} key={message._id} />
        ))}

        {messages.map((message) => (
          <MessageComponent
            message={message}
            user={user}
            key={message._id || message.attachments[0].public_id}
          />
        ))}
      </Stack>

      <form style={{ height: "10%" }} onSubmit={sendMessageHandler}>
        <Stack
          direction={"row"}
          sx={{
            height: "100%",
            padding: "1rem",
            alignItems: "center",
            position: "relative",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            type="text"
            placeholder="Type Message Here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <IconButton
            type="submit"
            sx={{
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",

              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorEl={fileMenuAnchorEl} chatId={chatId} />
    </>
  );
};

export default AppLayout(Chat);
