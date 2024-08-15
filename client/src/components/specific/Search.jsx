import { useInputValidation } from "6pp";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);

  const [searchUser, { isLoading }] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  const search = useInputValidation("");
  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending Friend Request...", { receiverId: id });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((error) => console.log(error));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search.value]);

  return (
    <>
      <Dialog open={isSearch} onClose={() => dispatch(setIsSearch(false))}>
        <Stack p={"2rem"} direction={"column"} width={"25rem"}>
          <DialogTitle textAlign={"center"}>Find People</DialogTitle>
          <TextField
            label=""
            value={search.value}
            onChange={search.changeHandler}
            variant={"outlined"}
            size={"small"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <List>
          {users.map((user, index) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Dialog>
    </>
  );
};

export default Search;
