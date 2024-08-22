import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrors, useMutation } from "../../hooks/hook";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const AddMemberDialog = ({ chatId }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { isAddMember } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const [addMember, isLoadingAddMember] = useMutation(
    useAddGroupMembersMutation
  );
  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i != id) : [...prev, id]
    );
  };

  const addMemberSubmitHandler = () => {
    addMember("Adding Member...", {
      chatId,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  console.log(data?.friends);

  useErrors([
    {
      isError,
      error,
    },
  ]);

  return (
    <>
      <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
          <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

          <Stack spacing={"1rem"}>
            {isLoading ? (
              <Skeleton />
            ) : data?.friends?.length > 0 ? (
              data?.friends.map((i) => (
                <UserItem
                  key={i._id}
                  user={i}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(i._id)}
                />
              ))
            ) : (
              <>
                <Typography textAlign={"center"}>No Friends</Typography>
              </>
            )}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
          >
            <Button onClick={closeHandler} color="error">
              Cancel
            </Button>
            <Button
              onClick={addMemberSubmitHandler}
              variant="contained"
              disabled={isLoadingAddMember}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default AddMemberDialog;
