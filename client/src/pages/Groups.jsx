import {
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { matblack } from "../constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LinkComponent } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats } from "../constants/sampleData";

const Groups = () => {
  const navigate = useNavigate();
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [initialGroupName, setInitialGroupName] = useState("");
  const [updatedGroupName, setUpdatedGroupName] = useState("");

  const chatId = useSearchParams()[0].get("group");

  console.log(chatId);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMenuMobileOpen((prev) => !prev);
  };

  const updateGroupNameHandler = () => {
    setIsEdit(false);
    console.log(updatedGroupName);
  };

  useEffect(() => {
    setInitialGroupName(`Group Name ${chatId}`);
    setUpdatedGroupName(`Group Name ${chatId}`);

    return () => {
      setInitialGroupName("");
      setUpdatedGroupName("");
      setIsEdit(false);
    };
  }, [chatId]);

  const icons = (
    <>
      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matblack,
            color: "white",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspace />
        </IconButton>
      </Tooltip>

      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <Tooltip title="Menu">
          <IconButton onClick={handleMobile}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );

  const groupName = (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={"1rem"}
        padding={"3rem"}
      >
        {isEdit ? (
          <>
            <TextField
              value={updatedGroupName}
              onChange={(e) => setUpdatedGroupName(e.target.value)}
            />
            <IconButton onClick={updateGroupNameHandler}>
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h4">{initialGroupName}</Typography>
            <IconButton onClick={() => setIsEdit(true)}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </Stack>
    </>
  );
  return (
    <>
      <Grid container height={"100vh"}>
        <Grid
          item
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
          sm={4}
          bgcolor={"bisque"}
        >
          <GroupList groups={sampleChats} chatId={chatId} />
        </Grid>

        <Grid
          item
          xs={12}
          sm={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            padding: "1rem 3rem",
          }}
        >
          {icons}

          {initialGroupName && groupName}
        </Grid>

        <Drawer
          open={isMenuMobileOpen}
          onClose={() => setIsMenuMobileOpen(false)}
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
        >
          <GroupList w="50vw" groups={sampleChats} chatId={chatId} />
        </Drawer>
      </Grid>
    </>
  );
};

const GroupList = ({ w = "100%", groups = [], chatId }) => (
  <Stack width={w}>
    {groups.length > 0 ? (
      groups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Typography textAlign={"center"} padding={"1rem"}>
        No Groups
      </Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <LinkComponent
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </LinkComponent>
  );
});

export default Groups;
