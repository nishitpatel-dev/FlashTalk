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
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { LinkComponent } from "../components/styles/StyledComponents";
import { matblack } from "../constants/color";
import { sampleChats } from "../constants/sampleData";
import { useErrors, useMutation } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useGetMyGroupsQuery,
  useRemoveGroupMembersMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";
import { motion } from "framer-motion";

const ConfirmDeleteDailog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDailog")
);

const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const navigate = useNavigate();
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [initialGroupName, setInitialGroupName] = useState("");
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  const [confirmDeleteDailog, setConfirmDeleteDailog] = useState(false);

  const chatId = useSearchParams()[0].get("group");
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useGetMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    {
      skip: !chatId,
    }
  );

  const [updateGroup, isLoadingGroupName] = useMutation(useRenameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useMutation(
    useRemoveGroupMembersMutation
  );
  const [deleteGroup, isLoadingDeleteGroup] = useMutation(
    useDeleteChatMutation
  );

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    if (groupDetails.data) {
      setInitialGroupName(groupDetails.data.chat.chatName);
      setUpdatedGroupName(groupDetails.data.chat.chatName);
    }

    return () => {
      setInitialGroupName("");
      setUpdatedGroupName("");
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  
  

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMenuMobileOpen((prev) => !prev);
  };

  const updateGroupNameHandler = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: updatedGroupName,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDailog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDailog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", { id: chatId });
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const deleteMemberHandler = (id) => {
    removeMember("Removing Member...", {
      chatId,
      userId: id,
    });
  };

  // useEffect(() => {
  //   if (chatId) {
  //     setInitialGroupName(`Group Name ${chatId}`);
  //     setUpdatedGroupName(`Group Name ${chatId}`);
  //   }

  //   return () => {
  //     setInitialGroupName("");
  //     setUpdatedGroupName("");
  //     setIsEdit(false);
  //   };
  // }, [chatId]);

  useEffect(() => {
    
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
            <IconButton
              onClick={updateGroupNameHandler}
              disabled={isLoadingGroupName}
            >
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h4">{initialGroupName}</Typography>
            <IconButton
              onClick={() => setIsEdit(true)}
              disabled={isLoadingGroupName}
            >
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

  return myGroups.isLoading ? (
    <Loader />
  ) : (
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
          <GroupList groups={myGroups?.data?.groupChats} chatId={chatId} />
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

          {chatId && (
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
                {isLoadingRemoveMember ? (
                  <CircularProgress />
                ) : (
                  groupDetails?.data?.chat?.members?.map((i) => (
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
                  ))
                )}
              </Stack>

              {ButtonGroup}
            </>
          )}
        </Grid>

        {isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog chatId={chatId} />
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
  const { chatName, avatar, _id } = group;

  return (
    <LinkComponent
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{chatName}</Typography>
      </Stack>
    </LinkComponent>
  );
});

export default Groups;
