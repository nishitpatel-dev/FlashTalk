import { Box, Drawer, Grid, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import { grayColor } from "../../constants/color";
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";

const SideBar = ({ w = "100vw" }) => {
  return (
    <>
      <Stack width={w}>SideBar</Stack>
    </>
  );
};

const AdminLayout = (OldComponent) => {
  return () => {
    const [isMobile, setIsMobile] = useState(false);

    const handleMobile = () => {
      setIsMobile((prev) => !prev);
    };

    const handleClose = () => {
      setIsMobile(false);
    };

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
