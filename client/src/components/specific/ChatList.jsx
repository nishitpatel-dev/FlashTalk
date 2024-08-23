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
  handleDeleteChat,
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

        console.log(members);

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );

        console.log(isOnline);

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
            handleDeleteChat={handleDeleteChat}
            isOnline={isOnline}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
