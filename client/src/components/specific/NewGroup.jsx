import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrors, useMutation } from "../../hooks/hook";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const dispatch = useDispatch();
  const groupName = useInputValidation("");

  const { isNewGroup } = useSelector((state) => state.misc);

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] =
    useMutation(useNewGroupMutation);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i != id) : [...prev, id]
    );
  };

  const submitHandler = () => {
    newGroup("Creating New Group...", {
      chatName: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <>
      <Dialog open={isNewGroup} onClose={closeHandler}>
        <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
          <DialogTitle textAlign={"center"} variant={"h4"}>
            New Group
          </DialogTitle>

          <TextField
            label="Group Name"
            value={groupName.value}
            onChange={groupName.changeHandler}
          />

          <Typography>Members</Typography>

          <Stack>
            {isLoading ? (
              <Skeleton />
            ) : (
              data?.friends?.map((user) => (
                <UserItem
                  user={user}
                  key={user._id}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(user._id)}
                />
              ))
            )}
          </Stack>

          <Stack direction={"row"} justifyContent={"space-evenly"}>
            <Button
              variant={"outlined"}
              color={"error"}
              size={"large"}
              onClick={closeHandler}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoadingNewGroup}
              variant={"contained"}
              color={"primary"}
              size={"large"}
              onClick={submitHandler}
            >
              Create
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default NewGroup;
