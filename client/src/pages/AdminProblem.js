import React, { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import Tab1 from "./AdminTabs/Tab1";
import Tab2 from "./AdminTabs/Tab2";
import Tab3 from "./AdminTabs/Tab3";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const useStyles = makeStyles({
  inputField: {
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#224957",
    color: "#ffffff",
  },
});

function AdminProblem() {
  const [value, setValue] = useState("1");
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const [text, setText] = useState("");

  const classes = useStyles();
  const pages = ["admin", "dbUpdate", "potd", "archive", "help"];
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassowrd, setCPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-min-height">
      <Navbar useage={pages} />
      <Typography variant="h4" color="primary" sx={{ my: 3, ml: 3 }}>
        Admin Dashboard
      </Typography>
      <Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              aria-label="Tabs list"
              onChange={handleChange}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              <Tab label="Announcement" value="1" />
              <Tab label="Events" value="2" />
              <Tab label="Problem" value="3" />
              {/* <Tab label="Tab Three" value="4" />
              <Tab label="Tab Three" value="5" /> */}
            </TabList>
          </Box>
          <TabPanel value="1">
            <Tab1 />
          </TabPanel>
          <TabPanel value="2">
            <Tab2 />
          </TabPanel>
          <TabPanel value="3">
            <Tab3 />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default AdminProblem;
