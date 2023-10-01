import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import PhotoCamera from "@mui/icons-material/PhotoCamera";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useAuthContext } from "../../hooks/useAuthContext";

function Tab1() {

    const [text, setText] = useState("");
    const { user } = useAuthContext();

    const client = axios.create({
      baseURL: "http://localhost:4000/",
      headers: { Authorization: `Bearer ${user.token}` },
      WithCredentials: true,
    });

    const postAnnouncement = (e) => {
        e.preventDefault();
        client
            .post("announcement/create", {
            description: text,
            })
        .then((res) => {
            console.log("Request sent successfully");
            setText('');
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <Box>
            <Typography variant="h5" color="primary" align="center">
                Announcement
            </Typography>
            <form onSubmit={postAnnouncement}>
                <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 3,
                    padding: 2,
                }}
                >
                <TextField
                    id="outlined-multiline-flexible"
                    label="Multiline"
                    multiline
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    sx={{ mr: 10 }}
                    rows={4}
                />
                
                {/* <Button
                    variant="contained"
                    component="label"
                    endIcon={<PhotoCamera />}
                >
                    Upload
                    <input hidden accept="image/*" multiple type="file" />
                </Button> */}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                    backgroundColor: "#20DF7F",
                    color: "#224957",
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: 6,
                    width: "10%",
                    "&:hover": {
                        backgroundColor: "#224957",
                        color: "#20DF7F",
                        pr: 1,
                    },
                    }}
                    endIcon={<KeyboardArrowRightIcon />}
                >
                    Submit
                </Button>
                </Box>
            </form>
        </Box>
    );
}

export default Tab1;
