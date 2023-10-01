import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  IconButton,
  Typography,
  Link,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { usePOTDContext } from "../hooks/usePOTDContext";
import { useAuthContext } from "../hooks/useAuthContext";

const POTD_Details = ({ prob }) => {
  const { user } = useAuthContext();
  const { dispatch } = usePOTDContext();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(prob.name);
  const [publishedAt, setPublishedAt] = useState(
    new Date(prob.publishedAt).toISOString().slice(0, 10)
  );
  const [linkToProblem, setLinkToProblem] = useState(prob.linkToProblem);
  const [solutionLink, setSolutionLink] = useState(prob.solutionLink);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // Close the delete confirmation dialog
      setIsDeleteDialogOpen(false);

      // Perform the delete operation
      const response = await fetch("http://localhost:4000/potd/" + prob._id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_POTD", payload: json });
        console.log("POTD has been deleted:", json);
      }
    } catch (error) {
      console.log("Error deleting POTD item:", error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const updatedItem = {
        name,
        publishedAt: new Date(publishedAt).toISOString(),
        linkToProblem,
        solutionLink,
      };

      const response = await fetch(`http://localhost:4000/potd/${prob._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        const updatedPotdItem = await response.json();
        // Dispatch the updated problem to the context
        dispatch({ type: "UPDATE_POTD", payload: updatedPotdItem });
        // Exit edit mode
        setEditMode(false);
      } else {
        const errorData = await response.json();
        console.log("Error updating POTD item:", errorData.error);
      }
    } catch (error) {
      console.log("Error updating POTD item:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleDeleteConfirmation = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const formattedDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <Card sx={{ backgroundColor: "#812BED", borderRadius: 3 }}>
        <CardActions sx={{ justifyContent: "right" }}>
          {user.role === "Admin" ? (
            <>
              {editMode ? (
                <>
                  <IconButton aria-label="save" onClick={handleSave}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton aria-label="cancel" onClick={handleCancelEdit}>
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton aria-label="edit" onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
              )}

              <IconButton
                aria-label="delete"
                onClick={handleDeleteConfirmation}
              >
                <DeleteForeverIcon />
              </IconButton>
            </>
          ) : (
            <>
              <br />
            </>
          )}
        </CardActions>
        {editMode ? (
          <>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Problem Link"
              value={linkToProblem}
              onChange={(e) => setLinkToProblem(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Solution Link"
              value={solutionLink}
              onChange={(e) => setSolutionLink(e.target.value)}
              fullWidth
              margin="normal"
            />
          </>
        ) : (
          <>
            <Link href={prob.linkToProblem} target="_blank" underline="none">
              <Typography variant="h4" textAlign="center" color="#ffffff">
                {prob.name}
              </Typography>
            </Link>
            <br />
            <Typography variant="subtitle1" textAlign="center" color="#ffffff">
              {formattedDate(prob.publishedAt)}
            </Typography>
            <br />
            <Link href={prob.solutionLink} target="_blank" underline="none">
              <Typography
                variant="subtitle1"
                textAlign="center"
                color="#ffffff"
              >
                Solution
              </Typography>
            </Link>
            <br />
          </>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default POTD_Details;
