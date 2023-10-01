import React, { useState } from "react";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

function FormRow(info) {
  return (
    <React.Fragment>
      <Grid item xs={1.5}>
        <Box
          component="div"
          sx={{
            bgcolor: "#224957",
            display: "flex",
            color: "white",
            height: "40px",
            justifyContent: "center",
            alignItems: "center",
            p: "2px",
          }}
        >
          <Typography
            align="center"
            sx={{
              lineHeight: "18px",
              fontFamily: "Lexend Deca",
              fontSize: 14.5,
            }}
          >
            {info.date}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={10.5}>
        <Box
          component="div"
          sx={{
            display: "flex",
            color: "#20DF7F",
            height: "45px",
            whiteSpace: "normal",
            overflow: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            align="center"
            sx={{
              lineHeight: "18px",
              fontFamily: "Lexend Deca",
              fontSize: 14.5,
              fontWeight: 420,
            }}
          >
            {info.announcement}
          </Typography>
        </Box>
      </Grid>
    </React.Fragment>
  );
}

export default function Announcements(props) {
  const { user } = useAuthContext();

  const client = axios.create({
    baseURL: "http://localhost:4000/",
    headers: { Authorization: `Bearer ${user.token}` },
    WithCredentials: true,
  });

  const [announcement1, setAnnouncement1] = useState({
    description: "No Recent Announcements",
    date: "",
  });
  const [announcement2, setAnnouncement2] = useState({
    description: "No Recent Announcements",
    date: "",
  });
  const [announcement3, setAnnouncement3] = useState({
    description: "No Recent Announcements",
    date: "",
  });
  const [announcement4, setAnnouncement4] = useState({
    description: "No Recent Announcements",
    date: "",
  });

  const handleAnnouncementChange = (data) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    data = data["announcement"];
    let n = data.length;
    let count = 0;
    for (let i = n - 1; i >= 0; i--) {
      if (count === 4) break;
      let day = data[i].createdAt.substring(8, 10);
      let month = monthNames[
        parseInt(data[i].createdAt.substring(5, 7)) - 1
      ].substring(0, 3);
      let finalDate = day + " " + month;
      let newAnnouncement = {
        description: data[i].description,
        date: finalDate,
      };

      if (count === 0) setAnnouncement1(newAnnouncement);
      else if (count === 1) setAnnouncement2(newAnnouncement);
      else if (count === 2) setAnnouncement3(newAnnouncement);
      else setAnnouncement4(newAnnouncement);
      count++;
    }
  };

  useEffect(() => {
    client
      .get("announcement/fetch")
      .then((res) => handleAnnouncementChange(res.data));
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        mr: "20px",
        ml: "20px",
        mt: "30px",
        mb: "20px",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Grid
        container
        spacing={1}
        xs={12}
        sm={6}
        md={5}
        lg={4}
        sx={{ bgcolor: "white", pb: "10px" }}
      >
        <Grid container item>
          <Box
            sx={{
              justifyContent: "center",
              alignContent: "center",
              width: "100%",
              display: "flex",
            }}
          >
            <Typography
              align="center"
              sx={{
                fontFamily: "Roboto",
                fontWeight: 500,
                fontSize: "h6.fontSize",
                color: "#224957",
              }}
            >
              Announcements
            </Typography>
          </Box>
        </Grid>

        <Grid container item spacing={1}>
          <FormRow
            date={announcement1.date}
            announcement={announcement1.description}
          />
        </Grid>
        <Grid container item spacing={1}>
          <FormRow
            date={announcement2.date}
            announcement={announcement2.description}
          />
        </Grid>
        <Grid container item spacing={1}>
          <FormRow
            date={announcement3.date}
            announcement={announcement3.description}
          />
        </Grid>
        <Grid container item spacing={1}>
          <FormRow
            date={announcement4.date}
            announcement={announcement4.description}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
