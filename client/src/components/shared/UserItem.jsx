import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <>
      <ListItem>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"1rem"}
          width={"100%"}
          sx={{ ...styling }}
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
            {name}
          </Typography>

          <IconButton
            size={"small"}
            sx={{
              bgcolor: isAdded ? "error.main" : "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: isAdded ? "error.dark" : "primary.dark",
              },
            }}
            onClick={() => handler(_id)}
            disabled={handlerIsLoading}
          >
            {isAdded ? <IoIosRemoveCircle /> : <IoMdAddCircle />}
          </IconButton>
        </Stack>
      </ListItem>
    </>
  );
};

export default memo(UserItem);
