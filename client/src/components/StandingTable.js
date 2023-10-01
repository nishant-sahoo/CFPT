import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import UpdateStandings from "./UpdateStanding";

function assignColor(rating) {
  let color = "black";
  if (rating < 1200 && rating !== 0) color = "grey";
  else if (rating < 1400) color = "green";
  else if (rating < 1600) color = "cyan";
  else if (rating < 1900) color = "blue";
  else if (rating < 2100) color = "purple";
  else if (rating < 2400) color = "orange";
  else if (rating >= 2400) color = "red";

  return color;
}

async function getUpdatedStandings(eventId) {
  const updatedStandings = await UpdateStandings(eventId);
  return updatedStandings;
}

const StandingTable = ({ event }) => {
  const [standing, setStanding] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchStandings() {
      const updatedStandings = await getUpdatedStandings(event);
      setStanding(updatedStandings);
    }
    fetchStandings();
  }, [event]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedStandings = standing.slice(startIndex, endIndex);

  let rank = startIndex + 1;

  return (
    <Box
      flexShrink={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
        mt: "30px",
        maxWidth: 800,
        pb: "40px",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
      >
        Standings
      </Typography>

      <TableContainer sx={{ maxWidth: 900 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white" }}>Rank</TableCell>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Handle</TableCell>
              <TableCell sx={{ color: "white" }}>Rating</TableCell>
              <TableCell sx={{ color: "white" }}>Problems Solved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedStandings.map((ele) => (
              <TableRow key={ele.userID}>
                <TableCell sx={{ color: "primary.main" }}>{rank++}</TableCell>
                <TableCell sx={{ color: "primary.main" }}>{ele.name}</TableCell>
                <TableCell sx={{ color: assignColor(ele.rating) }}>
                  {ele.handle}
                </TableCell>
                <TableCell sx={{ color: assignColor(ele.rating) }}>
                  {ele.rating}
                </TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  {ele.problemsSolved}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={standing.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default StandingTable;
