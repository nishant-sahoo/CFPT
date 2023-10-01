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
import { useAuthContext } from "../hooks/useAuthContext";

function LandingPage() {
  const { user } = useAuthContext();
  const pages = !user ? ["login", "register", "help"] : ["help"];

  return (
    <div style={{ backgroundColor: "#093545" }} className="page-min-height">
      <Navbar useage={pages} />
      <Box
        // flexShrink={1}
        sx={{
          backgroundColor: "#093545",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          padding: 2,
          paddingBottom: 2,
        }}
      >
        <Typography variant="h4" pt={5} textAlign="center" color="#ffffff">
          ---------- The Best ----------
        </Typography>
        <Typography variant="h3" pb={3} textAlign="center" color="#ffffff">
          Coding Practice
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          padding={2}
          textAlign="center"
          color="#ffffff"
          sx={{ maxWidth: 800 }}
        >
          Looking to take your coding skills to the next level? Join the
          Programming Club and start practicing with our exciting coding
          challenges! With a variety of problems uploaded by the club
          coordinators, you'll have plenty of opportunities to hone your coding
          abilities and improve your problem-solving skills. Plus, with our
          user-friendly website, accessing and solving the challenges has never
          been easier. So what are you waiting for? Sign up today and start
          coding your way to success!
        </Typography>

        <Button
          variant="contained"
          type="submit"
          sx={{
            backgroundColor: "#20DF7F",
            color: "#224957",
            mt: 5,
            borderRadius: 5,
            boxShadow: 6,
            width: "20%",
            pr: 1,
            "&:hover": {
              borderColor: "rgba(255,240,10,0.8)",
              backgroundColor: "#224957",
              color: "#20DF7F",
            },
          }}
          href="/login"
          endIcon={<KeyboardArrowRightIcon />}
        >
          Get Started
        </Button>
      </Box>
    </div>
  );
}

export default LandingPage;
