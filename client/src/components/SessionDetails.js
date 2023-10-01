import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { CardActionArea, IconButton, CardActions } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const SessionDetails = ({ session }) => {
  const { user } = useAuthContext();

  const handleDelete = async () => {
    const response = await fetch(
      "http://localhost:4000/archive/" + session._id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      console.log("Session has been deleted:", json);
    }
  };
  const pidTo = {
    pathname: `/problem/${session._id}`,
  };
  return (
    <div>
      <Card
        sx={{ backgroundColor: "#812BED", height: "20vh", borderRadius: 2 }}
      >
        <CardActions sx={{ justifyContent: "right" }}>
        </CardActions>
        <Link to={pidTo} style={{ textDecoration: "none" }}>
          <CardActionArea
            sx={{ top: "20%", position: "relative" }}
          >
            <Typography variant="h5" textAlign="center" color="#ffffff">
              {session.eventName}
            </Typography>
          </CardActionArea>
        </Link>
      </Card>
    </div>
  );
};

export default SessionDetails;
