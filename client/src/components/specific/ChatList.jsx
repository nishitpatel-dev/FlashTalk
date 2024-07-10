import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({ w = "100%", chats = [], chatId }) => {
  return (
    <Stack width={w} direction={"column"}>
      {chats?.map((data, index) => {
        const { avatar, name, _id, groupChat } = data;

        return (
          <ChatItem
            index={index}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            sameSender={chatId === _id}
            groupChat={groupChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
