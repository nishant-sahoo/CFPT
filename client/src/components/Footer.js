import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";

function Copyright() {
  return (
    <Typography variant="body2" color="grey" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://cfi.iitm.ac.in/" target={"_blank"}>
        CFI, IIT Madras
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Footer() {
  return (
    <footer className="footer-pin">
      <Box sx={{ backgroundColor: "black", p: 2, height: 43}} component="footer">
        <Copyright />
      </Box>
    </footer>
  );
}

export default Footer;
