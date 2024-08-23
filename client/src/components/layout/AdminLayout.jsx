import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { grayColor, matblack } from "../../constants/color";
import { adminLogout } from "../../redux/thunks/admin";

const AdminLink = styled(Link)({
  textDecoration: "none",
  borderRadius: "2rem",
  padding: "1rem 2rem",
  color: "black",
  "&:hover": {
    color: "rgba(0, 0, 0, 0.679)",
  },
});

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "User",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const SideBar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logOutHandler = () => {
    dispatch(adminLogout());
  };

  // console.log(location);

  return (
    <>
      <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
        <Typography variant="h5" textTransform={"uppercase"}>
          FlashTalk
        </Typography>

        <Stack spacing={"1rem"}>
          {adminTabs.map((i) => (
            <AdminLink
              key={i.path}
              to={i.path}
              sx={
                location.pathname === i.path && {
                  bgcolor: matblack,
                  color: "white",
                  "&:hover": {
                    color: "white",
                  },
                }
              }
            >
              <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                {i.icon}
                <Typography>{i.name}</Typography>
              </Stack>
            </AdminLink>
          ))}

          <AdminLink onClick={logOutHandler}>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              <ExitToAppIcon />
              <Typography>Logout</Typography>
            </Stack>
          </AdminLink>
        </Stack>
      </Stack>
    </>
  );
};

const AdminLayout = (OldComponent) => {
  return () => {
    const { isAdmin } = useSelector((state) => state.auth);
    const [isMobile, setIsMobile] = useState(false);

    const handleMobile = () => {
      setIsMobile((prev) => !prev);
    };

    const handleClose = () => {
      setIsMobile(false);
    };

    if (!isAdmin) return <Navigate to={"/admin"} />;

    return (
      <>
        <Grid container minHeight={"100vh"}>
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "fixed",
              right: "1rem",
              top: "1rem",
            }}
          >
            <IconButton onClick={handleMobile}>
              {isMobile ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <SideBar />
          </Grid>

          <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: grayColor }}>
            <OldComponent />
          </Grid>

          <Drawer open={isMobile} onClose={handleClose}>
            <SideBar w="50vw" />
          </Drawer>
        </Grid>
      </>
    );
  };
};

export default AdminLayout;
