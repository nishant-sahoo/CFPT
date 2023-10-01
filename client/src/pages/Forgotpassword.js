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
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  inputField: {
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#224957",
    color: "white",
  },
});

function Forgotpassword() {
  const client = axios.create({
    baseURL: "http://localhost:4000/",
    WithCredentials: true,
  });
  const [err, setError] = useState("");
  const [message, setMessage] = useState("");
  const classes = useStyles();
  const pages = ["register", "help"];

  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [cpasswordError, setCPasswordError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const isPass = useLocation().search;

  //   console.log(isPass);

  const handleSubmit = async (e) => {
    if (!passwordError && !cpasswordError) {
      const queryParams = new URLSearchParams(isPass);
      const token = queryParams.get("value");
      console.log(token);
      try {
        const res = await client.post("auth/forgot-password", {
          token: token,
          password: password,
        });
        setMessage(res.data.data);
        setError("");
      } catch (err) {
        console.log(err);
        setError(err.response.data.data);
        setMessage("");
      }
    }
    navigate("/login");
  };
  const handleEmail = async (e) => {
    // console.log(e);
    if (emailError === "") {
      try {
        const res = await client.post(`auth/send-email`, {
          email: email,
          purpose: "FORGOTPASS",
        });
        console.log(res);
        setError("");
        setMessage(res.data.data);
      } catch (err) {
        console.log(err.response.data);
        setError(err.response.data.data);
        setMessage("");
      }
    }
  };
  return (
    <div style={{ backgroundColor: "#093545" }} className="page-min-height">
      <Navbar useage={pages} />
      <Container maxWidth="xl">
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
            sx={{ fontSize: "2.4rem" }}
            padding={3}
            mt={2}
            textAlign="center"
            color="#ffffff"
          >
            {!isPass ? "Forgot Passsword" : "New Password"}
          </Typography>
          {isPass ? (
            <>
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
                  setMessage("");
                }}
                type={"password"}
                error={passwordError}
                helperText={
                  passwordError ? (
                    <Typography
                      sx={{
                        color: "#f70d1a",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      Password must be at least 8 characters
                    </Typography>
                  ) : (
                    ""
                  )
                }
                sx={{ input: { color: "white" } }}
                label={
                  <Typography sx={{ color: "#20DF7F" }}>Password</Typography>
                }
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
                  setMessage("");
                }}
                type={"password"}
                error={cpasswordError}
                helperText={
                  cpasswordError ? (
                    <Typography
                      sx={{
                        color: "#f70d1a",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
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
            </>
          ) : (
            <>
              <TextField
                id="forgot-email"
                className={classes.inputField}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(e.target.value)) {
                    setEmailError("Eneter Email in Proper Format");
                  } else {
                    setEmailError("");
                  }
                  setMessage("");
                }}
                type={"email"}
                sx={{ input: { color: "white" }, mr: 1 }}
                label={
                  <Typography sx={{ color: "#20DF7F" }}>
                    Email Address
                  </Typography>
                }
                error={emailError}
                helperText={
                  emailError !== "" ? (
                    <Typography
                      sx={{
                        color: "#f70d1a",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      {emailError}
                    </Typography>
                  ) : (
                    ""
                  )
                }
                variant="filled"
                margin={"normal"}
                color="secondary"
              />
            </>
          )}

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
            onClick={!isPass ? handleEmail : handleSubmit}
            endIcon={<KeyboardArrowRightIcon />}
          >
            {!isPass ? "Send" : "Submit"}
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
              {err}
            </Typography>
          )}
          {
            <Typography
              sx={{
                color: "#20DF7F",
                fontSize: "15px",
                mt: 1,
                fontWeight: 800,
              }}
            >
              {message}
            </Typography>
          }
        </Box>
      </Container>
    </div>
  );
}

export default Forgotpassword;
