import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import moment from "moment"

const Profile = () => {
  return (
    <>
      <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
        <Avatar
          sx={{
            width: 150,
            height: 150,
            objectFit: "contain",
            marginBottom: "1rem",
            border: "5px solid white",
          }}
        />
        <ProfileCard heading={"Bio"} text={"Kuch bhi"} />
        <ProfileCard heading={"Username"} text={"@nishitpatel__"} />
        <ProfileCard heading={"Name"} text={"Nishit Patel"} />
        <ProfileCard heading={"Joined"} text={moment("2023-09-05T00:00:00.000Z").fromNow()} />


      </Stack>
    </>
  );
};

const ProfileCard = ({ text, heading, Icon }) => {
  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        color={"white"}
        textAlign={"center"}
      >
        {Icon && Icon}

        <Stack>
          <Typography variant="body1">{text}</Typography>
          <Typography color={"gray"} variant="caption">{heading}</Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default Profile;
