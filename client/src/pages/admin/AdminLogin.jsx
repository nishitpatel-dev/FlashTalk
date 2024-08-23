import { useInputValidation } from "6pp";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminLogin, verifyAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {
  const secretKey = useInputValidation("");

  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(verifyAdmin());
  }, []);

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
