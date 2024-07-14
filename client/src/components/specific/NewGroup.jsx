import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i != id) : [...prev, id]
    );
  };

  console.log(selectedMembers);

  const submitHandler = () => {};

  const groupName = useInputValidation();

  const closeHandler = () => {};

  return (
    <>
      <Dialog open onClose={closeHandler}>
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
            {members.map((user, index) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))}
          </Stack>

          <Stack direction={"row"} justifyContent={"space-evenly"}>
            <Button variant={"outlined"} color={"error"} size={"large"}>
              Cancel
            </Button>
            <Button
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
