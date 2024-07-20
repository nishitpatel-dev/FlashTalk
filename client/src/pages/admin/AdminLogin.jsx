import { useInputValidation } from "6pp";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";

const isAdmin = true;

const AdminLogin = () => {
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submit");
  };

  if (isAdmin) return <Navigate to={"/admin/dashboard"} />;

  return (
    <>
      <div
        style={{
          background: "linear-gradient(rgb(226 185 255), rgb(145, 152, 229))",
          overflowY: "hidden",
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
            <Typography variant="h5">Admin Login</Typography>
            <form
              style={{
                marginTop: "1rem",
                width: "100%",
              }}
              onSubmit={submitHandler}
            >
              <TextField
                required
                fullWidth
                label="Secret Key"
                margin="normal"
                variant="outlined"
                type="password"
                value={secretKey.value}
                onChange={secretKey.changeHandler}
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
            </form>
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default AdminLogin;
