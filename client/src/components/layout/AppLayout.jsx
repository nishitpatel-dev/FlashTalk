import React, { useEffect } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useGetMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobileMenu } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
import { useErrors } from "../../hooks/hook";

const AppLayout = (OldComponent) => {
  return () => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;

    const { isMobileMenu } = useSelector((state) => state.misc);

    const { isLoading, data, isError, error, refetch } = useGetMyChatsQuery("");
    console.log(data);
    
    useErrors([{ isError, error }]);

    const handleMobileMenuClose = () => {
      dispatch(setIsMobileMenu(false));
    };

    return (
      <>
        <Title />
        <Header />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobileMenu} onClose={handleMobileMenuClose}>
            <ChatList w="70vw" chats={data?.chats} chatId={chatId} />
          </Drawer>
        )}

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList chats={data?.chats} chatId={chatId} />
            )}
          </Grid>

          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <OldComponent />
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile />
          </Grid>
        </Grid>

        <p>Footer</p>
      </>
    );
  };
};

export default AppLayout;
