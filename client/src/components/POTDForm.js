import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePOTDContext } from "../hooks/usePOTDContext";
import { makeStyles, styled } from "@mui/styles";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const POTDForm = () => {
  const { dispatch } = usePOTDContext();

  const [name, setName] = useState("");
  const [linkToProblem, setProbLink] = useState("");
  const [solutionLink, setSolnLink] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prob = { name, linkToProblem, solutionLink, publishedAt };

    const response = await fetch("http://localhost:4000/potd/create", {
      method: "POST",
      body: JSON.stringify(prob),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setName("");
      setProbLink("");
      setSolnLink("");
      setPublishedAt("");
      dispatch({ type: "CREATE_POTD", payload: json });
      console.log("New POTD has been added:", json);
    }
  };

  return (
    <Accordion sx={{ width: "50vw"/*, marginX: "auto"*/}}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Add Problem</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Problem Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <br />

          <TextField
            label="Date"
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />

          <TextField
            label="Problem Link"
            value={linkToProblem}
            onChange={(e) => setProbLink(e.target.value)}
            fullWidth
            margin="normal"
          />
          <br />

          <TextField
            label="Solution Link"
            value={solutionLink}
            onChange={(e) => setSolnLink(e.target.value)}
            fullWidth
            margin="normal"
          />
          <br />

          <Button variant="contained" color="primary" type="submit">
            Add Problem
          </Button>
          {/* {error && <div className="error">{error}</div>} */}
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default POTDForm;
