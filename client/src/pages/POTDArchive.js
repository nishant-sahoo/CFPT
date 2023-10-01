import { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Navbar from "../components/Navbar";
import POTD_Details from "../components/POTD_Details";
import POTDForm from "../components/POTDForm";
import { usePOTDContext } from "../hooks/usePOTDContext";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

function POTDArchive() {
  const { user } = useAuthContext();
  let pages = ["home", "profile", "archive", "potd", "help"];
  if (user.role === "Admin") { pages = ["admin", "dbUpdate", "potd", "archive", "help"]; }

  const { potd, dispatch } = usePOTDContext();


  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get("http://localhost:4000/potd/", {
        headers: { Authorization: `Bearer ${user.token}` },
      }); //fix this before deployment (CORS)
      // console.log(response)

      if (response.status == 200) {
        const sortedData = response.data.sort((a, b) => {
          // Sort in decreasing order based on publishedAt
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        });
  
        console.log(sortedData);
        dispatch({ type: "SET_POTD", payload: sortedData });
      }
    };

    fetchDetails();
  }, [dispatch]);

  // Make it like ProblemSet Page
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
          POTD Archive
        </Typography>

        <br />
        <Grid container justifyContent="center">
          {user.role === "Admin" ? <POTDForm /> : <></>}

          <Grid container spacing={3} marginY={1} marginX={2}>
            {potd &&
              potd.map((prob) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={prob._id}>
                  <POTD_Details prob={prob} key={prob._id} />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default POTDArchive;
