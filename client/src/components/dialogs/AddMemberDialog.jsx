import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";

const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId }) => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i != id) : [...prev, id]
    );
  };

  const addMemberSubmitHandler = () => {};

  const closeHandler = () => {};

  return (
    <>
      <Dialog open onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
          <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

          <Stack spacing={"1rem"}>
            {members.length > 0 ? (
              members.map((i) => (
                <UserItem
                  key={i._id}
                  user={i}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(i._id)}
                />
              ))
            ) : (
              <>
                <Typography>No Contacts</Typography>
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
