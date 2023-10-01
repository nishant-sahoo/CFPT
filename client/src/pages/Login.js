import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { makeStyles } from "@mui/styles";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import axios from "axios";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  inputField: {
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#224957",
    color: "white",
  },
});

function Login() {
  const client = axios.create({
    baseURL: "http://localhost:4000/",
    WithCredentials: true,
  });
  const { login, error, isLoading } = useLogin();
  const [err, setError] = useState(error !== "");
  const classes = useStyles();
  const pages = ["register", "help"];

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [vemail, setVEmail] = useState("");
  const [vemailError, setVEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    setError(true);
  };
  const handleVerification = async (e) => {
    // console.log(e);
    if (vemailError === "") {
      try {
        const res = await client.post(`auth/send-email`, {
          email: vemail,
          purpose: "VERIFICATION",
        });
        console.log(res);
      } catch (err) {
        console.log(err.response.data);
        setVEmailError(err.response.data.data);
      }
    }
  };
  return (
    <div style={{ backgroundColor: "#093545" }} className="page-min-height">
      <Navbar useage={pages} />
      <Container maxWidth="xl">
        <form onSubmit={handleSubmit}>
          <Box
            flexShrink={1.2}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              mt: 1,
              padding: 3,
              maxWidth: 400,
            }}
          >
            <Typography
              variant="h3"
              padding={3}
              mt={2}
              textAlign="center"
              color="#ffffff"
            >
              Login
            </Typography>

            <Typography
              variant="h7"
              mt={2}
              mb={2}
              textAlign="center"
              color="#ffffff"
            >
              Start Journey into Coding!
            </Typography>

            <TextField
              id="username"
              className={classes.inputField}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              type={"email"}
              sx={{ input: { color: "white" } }}
              label={<Typography sx={{ color: "#20DF7F" }}>Email</Typography>}
              variant="filled"
              margin={"normal"}
              color="secondary"
            />
            <TextField
              id="password"
              className={classes.inputField}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              type={"password"}
              sx={{ input: { color: "white" } }}
              label={
                <Typography sx={{ color: "#20DF7F" }}>Password</Typography>
              }
              variant="filled"
              margin={"normal"}
              color="secondary"
            />

            <FormGroup
              sx={{
                fontSize: "0.5em",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                sx={{ color: "#ffffff", mr: 5 }}
                control={
                  <Checkbox
                    sx={{ backgroundColor: "primary" }}
                    color="secondary"
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    Remember Me
                  </Typography>
                }
              />
              <Button
                variant="text"
                sx={{
                  fontSize: "0.85rem",
                  color: "#20DF7F",
                  textTransform: "capitalize",
                  "&:hover": { color: "#ffffff" },
                }}
                component={Link}
                to={{
                  pathname: "/forgot-password",
                }}
              >
                Forgot Password?
              </Button>
            </FormGroup>

            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#20DF7F",
                color: "#224957",
                mt: 3,
                borderRadius: 2,
                boxShadow: 6,
                width: "60%",
                "&:hover": {
                  borderColor: "rgba(255,240,10,0.8)",
                  backgroundColor: "#224957",
                  color: "#20DF7F",
                  pr: 1,
                },
              }}
              disabled={isLoading}
              endIcon={<KeyboardArrowRightIcon />}
            >
              Login
            </Button>
            {err && (
              <Typography
                sx={{
                  color: "#f70d1a",
                  fontSize: "15px",
                  mt: 1,
                  fontWeight: 800,
                }}
              >
                {error}
              </Typography>
            )}
          </Box>
        </form>
        <Box
          flexShrink={1.2}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            mt: 0,
            padding: 1,
            maxWidth: 400,
          }}
        >
          <TextField
            id="verify-email"
            className={classes.inputField}
            onChange={(e) => {
              setVEmail(e.target.value);
              setError(false);
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(e.target.value)) {
                setVEmailError("Eneter Email in Proper Format");
              } else {
                setVEmailError("");
              }
            }}
            type={"email"}
            sx={{ input: { color: "white" }, mr: 1 }}
            label={
              <Typography sx={{ color: "#20DF7F" }}>
                Verification Email
              </Typography>
            }
            error={vemailError}
            helperText={
              vemailError !== "" ? (
                <Typography
                  sx={{ color: "#f70d1a", fontSize: "12px", fontWeight: 800 }}
                >
                  {vemailError}
                </Typography>
              ) : (
                ""
              )
            }
            variant="filled"
            margin={"normal"}
            color="secondary"
          />

          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#20DF7F",
              color: "#224957",
              mt: 1,
              borderRadius: 2,
              boxShadow: 6,
              width: "40%",
              "&:hover": {
                borderColor: "rgba(255,240,10,0.8)",
                backgroundColor: "#224957",
                color: "#20DF7F",
                pr: 1,
              },
            }}
            onClick={handleVerification}
            endIcon={<KeyboardArrowRightIcon />}
          >
            Resend
          </Button>
        </Box>
      </Container>
      {/* <svg width="max-content" height='140' viewBox="0 0 1280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0L53 4.17052C107 8.34104 213 16.6821 320 30.7977C427 45.2341 533 65.7659 640 69.9364C747 74.1069 853 61.5954 960 57.7457C1067 53.5751 1173 57.7457 1227 59.6705L1280 61.5954V111H1227C1173 111 1067 111 960 111C853 111 747 111 640 111C533 111 427 111 320 111C213 111 107 111 53 111H0V0Z" fill="#20DF7F" fill-opacity="0.8" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 44.4L42.6667 53.28C85.3333 62.16 170.667 79.92 256 75.48C341.333 71.04 426.667 44.4 512 26.64C597.333 8.88 682.667 0 768 0C853.333 0 938.667 8.88 1024 24.42C1109.33 39.96 1194.67 62.16 1237.33 73.26L1280 84.36V111H1237.33C1194.67 111 1109.33 111 1024 111C938.667 111 853.333 111 768 111C682.667 111 597.333 111 512 111C426.667 111 341.333 111 256 111C170.667 111 85.3333 111 42.6667 111H0V44.4Z" fill="#224957" fill-opacity="0.8" />
            </svg> */}
    </div>
  );
}

export default Login;
