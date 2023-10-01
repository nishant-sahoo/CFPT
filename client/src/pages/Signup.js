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

import { Link } from "react-router-dom";
import axios from "axios";
import { useSignup } from "../hooks/useSignup";

const useStyles = makeStyles({
  inputField: {
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#224957",
    color: "#ffffff",
  },
});

function Signup() {
  const { signup, isLoading, error } = useSignup();
  const client = axios.create({
    baseURL: "http://localhost:4000/",
  });
  const classes = useStyles();
  const pages = ["login", "help"];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassowrd, setCPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [cpasswordError, setCPasswordError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameError && !emailError && !passwordError && !cpasswordError) {
      signup(name, email, password, cpassowrd)
        .then(async () => {
          if (!error) {
            try {
              const res = await client.post(`auth/send-email`, {
                email: email,
                purpose: "VERIFICATION",
              });
              console.log(res);
            } catch (err) {
              console.log(err.response.data);
              // setVEmailError(err.response.data.data);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="page-min-height">
      <Navbar useage={pages} />
      <form onSubmit={handleSubmit}>
        <Box
          flexShrink={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            padding: 2,
            maxWidth: 400,
          }}
        >
          <Typography
            variant="h3"
            padding={3}
            textAlign="center"
            color="#224957"
          >
            Sign Up
          </Typography>
          <TextField
            id="name"
            className={classes.inputField}
            sx={{ input: { color: "white" } }}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.length <= 2) {
                setNameError(true);
              } else {
                setNameError(false);
              }
            }}
            type={"text"}
            error={nameError}
            helperText={
              nameError ? (
                <Typography
                  sx={{ color: "#f70d1a", fontSize: "12px", fontWeight: 800 }}
                >
                  Name must be longer than 2 characters
                </Typography>
              ) : (
                ""
              )
            }
            label={<Typography sx={{ color: "#20DF7F" }}>Name</Typography>}
            variant="filled"
            margin={"normal"}
            color="secondary"
          />
          <TextField
            id="email"
            className={classes.inputField}
            onChange={(e) => {
              setEmail(e.target.value);
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(e.target.value)) {
                setEmailError(true);
              } else {
                setEmailError(false);
              }
            }}
            type={"email"}
            error={emailError}
            helperText={
              emailError ? (
                <Typography
                  sx={{ color: "#f70d1a", fontSize: "12px", fontWeight: 800 }}
                >
                  Invalid email format
                </Typography>
              ) : (
                ""
              )
            }
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
              if (e.target.value.length < 8) {
                setPasswordError(true);
              } else {
                setPasswordError(false);
              }
            }}
            type={"password"}
            error={passwordError}
            helperText={
              passwordError ? (
                <Typography
                  sx={{ color: "#f70d1a", fontSize: "12px", fontWeight: 800 }}
                >
                  Password must be at least 8 characters
                </Typography>
              ) : (
                ""
              )
            }
            sx={{ input: { color: "white" } }}
            label={<Typography sx={{ color: "#20DF7F" }}>Password</Typography>}
            variant="filled"
            margin={"normal"}
            color="secondary"
          />
          <TextField
            id="cpassword"
            className={classes.inputField}
            onChange={(e) => {
              setCPassword(e.target.value);
              if (password !== e.target.value) {
                setCPasswordError(true);
              } else {
                setCPasswordError(false);
              }
            }}
            type={"password"}
            error={cpasswordError}
            helperText={
              cpasswordError ? (
                <Typography
                  sx={{ color: "#f70d1a", fontSize: "12px", fontWeight: 800 }}
                >
                  Confirm Passowrd must match with Password
                </Typography>
              ) : (
                ""
              )
            }
            sx={{ input: { color: "white" } }}
            label={
              <Typography sx={{ color: "#20DF7F" }}>
                Confirm Password
              </Typography>
            }
            variant="filled"
            margin={"normal"}
            color="secondary"
          />

          <Button
            variant="text"
            sx={{ ml: 20, fontSize: "0.75em", "&:hover": { color: "#20DF7F" } }}
            component={Link}
            to={{
              pathname: "/login",
            }}
          >
            Already have an account?
          </Button>

          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#20DF7F",
              color: "#224957",
              mt: 1,
              borderRadius: 2,
              boxShadow: 6,
              width: "60%",
              "&:hover": {
                backgroundColor: "#224957",
                color: "#20DF7F",
                pr: 1,
              },
            }}
            disabled={isLoading}
            endIcon={<KeyboardArrowRightIcon />}
          >
            Register
          </Button>
          {error && (
            <Typography
              sx={{
                color: "#f70d1a",
                fontSize: "16px",
                mt: 1,
                fontWeight: 800,
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </form>
    </div>
  );
}

export default Signup;
