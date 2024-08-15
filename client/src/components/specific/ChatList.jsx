import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  onlineUsers = [],
}) => {
  return (
    <Stack
      width={w}
      direction={"column"}
      sx={{
        overflow: "auto",
        height: "100%",
      }}
    >
      {chats?.map((data, index) => {
        const { avatar, chatName, _id, isGroupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          (element) => element.chatId == _id
        );

        return (
          <ChatItem
            index={index}
            avatar={avatar}
            name={chatName}
            _id={_id}
            key={_id}
            sameSender={chatId === _id}
            groupChat={isGroupChat}
            newMessageAlert={newMessageAlert}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
