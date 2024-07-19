import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { matblack } from "../constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LinkComponent } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats, sampleUsers } from "../constants/sampleData";
import UserItem from "../components/shared/UserItem";

const ConfirmDeleteDailog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDailog")
);

const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const isAddMember = false;

const Groups = () => {
  const navigate = useNavigate();
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [initialGroupName, setInitialGroupName] = useState("");
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  const [confirmDeleteDailog, setConfirmDeleteDailog] = useState(false);

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

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDailog(true);
    console.log("openConfirmDeleteHandler");
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDailog(false);
  };

  const openAddMemberHandler = () => {
    console.log("openAddMemberHandler");
  };

  const deleteHandler = () => {
    setConfirmDeleteDailog(false);
    console.log("Group Deleted");
  };

  const deleteMemberHandler = (id) => {
    console.log("Member Deleted ", id);
  };

  useEffect(() => {
    if (chatId) {
      setInitialGroupName(`Group Name ${chatId}`);
      setUpdatedGroupName(`Group Name ${chatId}`);
    }

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

  const ButtonGroup = (
    <>
      <Stack
        direction={{
          xs: "column-reverse",
          sm: "row",
        }}
        spacing={"1rem"}
        p={{
          xs: "0",
          sm: "1rem",
          md: "1rem 4rem",
        }}
      >
        <Button
          size="large"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={openConfirmDeleteHandler}
        >
          Delete Group
        </Button>

        <Button
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddMemberHandler}
        >
          Add Member
        </Button>
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

          {initialGroupName && (
            <>
              {groupName}

              <Typography
                margin={"2rem"}
                alignSelf={"flex-start"}
                variant="body1"
              >
                Members
              </Typography>

              <Stack
                maxWidth={"45rem"}
                width={"100%"}
                boxSizing={"border-box"}
                padding={{ sm: "1rem", xs: "0", md: "1rem 4rem" }}
                spacing={"2rem"}
                height={"50vh"}
                overflow={"auto"}
              >
                {sampleUsers.map((i) => (
                  <UserItem
                    key={i._id}
                    user={i}
                    isAdded
                    handler={deleteMemberHandler}
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                  />
                ))}
              </Stack>

              {ButtonGroup}
            </>
          )}
        </Grid>

        {isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog />
          </Suspense>
        )}

        {confirmDeleteDailog && (
          <>
            <Suspense fallback={<Backdrop open />}>
              <ConfirmDeleteDailog
                open={confirmDeleteDailog}
                handleClose={closeConfirmDeleteHandler}
                deleteHandler={deleteHandler}
              />
            </Suspense>
          </>
        )}

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
  <Stack width={w} overflow={"auto"} height={"100vh"}>
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
