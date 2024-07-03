import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { IoIosCamera } from "react-icons/io";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { useInputValidation, useStrongPassword, useFileHandler } from "6pp";
import { usernamevalidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setisLogin] = useState(true);

  const handleFileInputClick = () => {
    document.getElementById("fileInput").click();
  };

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernamevalidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single");

  const handleLogin = (e) => {
    e.preventDefault();
  };

  const handleSignup = (e) => {
    e.preventDefault();
  };
  
//   console.log(avatar.preview);
//   console.log(avatar.file);


  return (
    <>
      <div
        style={{
          background: "linear-gradient(rgb(226 185 255), rgb(145, 152, 229))",
          overflowY: "hidden"
        }}
      >
        <Container
          component={"main"}
          maxWidth={"xs"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isLogin ? (
              <>
                <Typography variant="h5">Login</Typography>
                <form
                  style={{
                    marginTop: "1rem",
                    width: "100%",
                  }}
                  onSubmit={handleLogin}
                >
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    type="text"
                    value={username.value}
                    onChange={username.changeHandler}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Password"
                    margin="normal"
                    variant="outlined"
                    type="password"
                    value={password.value}
                    onChange={password.changeHandler}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{
                      marginTop: "1rem",
                    }}
                  >
                    Login
                  </Button>

                  <Typography textAlign={"center"} margin={"1rem"}>
                    OR
                  </Typography>

                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => setisLogin(false)}
                  >
                    Register
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Typography variant="h5">Sign Up</Typography>
                <form
                  style={{
                    marginTop: "1rem",
                    width: "100%",
                  }}
                  onSubmit={handleSignup}
                >
                  <Stack
                    sx={{
                      position: "relative",
                      width: "10rem",
                      margin: "auto",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: "10rem",
                        height: "10rem",
                        objectFit: "contain",
                      }}
                      src={avatar.preview}
                    />
                    <IconButton
                      onClick={handleFileInputClick}
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        ":hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                    >
                      <>
                        <IoIosCamera />
                        <VisuallyHiddenInput
                          type="file"
                          id="fileInput"
                          onChange={avatar.changeHandler}
                        />
                      </>
                    </IconButton>
                  </Stack>

                  {avatar.error && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{
                        m: "1rem auto",
                        width: "fit-content",
                        display: "block",
                      }}
                    >
                      {avatar.error}
                    </Typography>
                  )}

                  <TextField
                    required
                    fullWidth
                    label="Name"
                    margin="normal"
                    variant="outlined"
                    type="text"
                    sx={{
                      marginTop: "20px",
                    }}
                    value={name.value}
                    onChange={name.changeHandler}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Bio"
                    margin="normal"
                    variant="outlined"
                    type="text"
                    value={bio.value}
                    onChange={bio.changeHandler}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    type="text"
                    value={username.value}
                    onChange={username.changeHandler}
                  />

                  {username.error && (
                    <Typography color="error" variant="caption">
                      {username.error}
                    </Typography>
                  )}

                  <TextField
                    required
                    fullWidth
                    label="Password"
                    margin="normal"
                    variant="outlined"
                    type="password"
                    value={password.value}
                    onChange={password.changeHandler}
                  />

                  {password.error && (
                    <Typography color="error" variant="caption">
                      {password.error}
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{
                      marginTop: "1rem",
                    }}
                  >
                    Register
                  </Button>

                  <Typography textAlign={"center"} margin={"1rem"}>
                    OR
                  </Typography>

                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => setisLogin(true)}
                  >
                    Login
                  </Button>
                </form>
              </>
            )}
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default Login;
