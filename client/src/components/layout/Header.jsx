import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orange } from "../../constants/color.js";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import axios from "axios";
import { server } from "../../constants/config.js";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userDoesNotExist } from "../../redux/reducers/auth.js";
import {
  setIsMobileMenu,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc.js";
import { resetNotificationCount } from "../../redux/reducers/chat.js";

const Notification = React.lazy(() => import("../specific/Notification"));
const Search = React.lazy(() => import("../specific/Search"));
const NewGroup = React.lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);

  const navigate = useNavigate();

  const handleMobile = () => {
    dispatch(setIsMobileMenu(true));
  };

  const openSearchDailog = () => {
    dispatch(setIsSearch(true));
  };

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const navigateToGroup = () => {
    navigate("/groups");
  };

  const handleNotifications = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      toast.success(data.message);
      dispatch(userDoesNotExist());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              FlashTalk
            </Typography>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" size="large" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box>
              <Icon
                title={"Search"}
                onClick={openSearchDailog}
                button={<SearchIcon />}
              />
              <Icon
                title={"New Group"}
                onClick={openNewGroup}
                button={<AddIcon />}
              />

              <Icon
                title={"Manage Group"}
                onClick={navigateToGroup}
                button={<GroupIcon />}
              />

              <Icon
                title={"Notifications"}
                onClick={handleNotifications}
                button={<NotificationsIcon />}
                value={notificationCount}
              />

              <Icon
                title={"Logout"}
                onClick={logoutHandler}
                button={<LogoutIcon />}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroup />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notification />
        </Suspense>
      )}
    </>
  );
};

const Icon = ({ title, onClick, button, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {button}
          </Badge>
        ) : (
          button
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
