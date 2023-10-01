import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { CircularProgress, Grid } from "@mui/material";
import SessionForm from "../components/SessionForm";
import SessionDetails from "../components/SessionDetails";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

function Archive() {
  const { user } = useAuthContext();
  
  let pages = ["home", "profile", "archive", "potd", "help"];
  if (user.role === "Admin") { pages = ["admin", "dbUpdate", "potd", "archive", "help"]; }

  const [loading, setLoading] = useState(true);

  const [sessions, setSessions] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await axios.get("http://localhost:4000/archive/", {
        headers: { Authorization: `Bearer ${user.token}` },
      }); //fix this before deployment (CORS)

      if (response.status == 200) {
        setSessions(response.data);
        console.log(response.data);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="page-min-height">
      <Box sx={{ backgroundColor: "", paddingBottom: 3 }}>
        <Navbar useage={pages} />
        <Typography
          variant="h2"
          textAlign="center"
          pt={2}
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          Archives
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          {loading ? <CircularProgress /> : <></>}
        </Box>
        <Container>
          <Grid container spacing={3} marginY={1}>
            {sessions &&
              sessions.map((session) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={session._id}>
                  <SessionDetails session={session} key={session._id} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>

      {/* <SessionForm /> */}
    </div>
  );
}

export default Archive;
