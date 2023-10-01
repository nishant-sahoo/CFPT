import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from '@mui/material/DialogContentText';
import Button  from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { Typography } from '@mui/material';


export function DialogBox({ diaValue, openDialog, setOpenDialog }) {
  const scroll = "paper";

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Tutorial</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText>{diaValue}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function InstructionBox(props){
    
    return(
        <Dialog open={props.open}>
            <DialogTitle>Verify your Codeforces handle</DialogTitle>
            <DialogContentText ml={5} mr={5} >
                <Typography gutterBottom>
                If you continue, a link to a codeforces problem will be displayed.
                You need to make a submission to that problem with your handle in 25s
                to verify.
                </Typography>
                <Typography>
                You need <strong>not</strong> make a correct submission. Just type some 'xyz' in the solution and submit.
                </Typography>
            </DialogContentText>
            <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={props.onContinue}>Continue</Button>
            </DialogActions>
        </Dialog>
    )
}

export function DeleteAccountDialogBox(props){

    return(
        <Dialog open = {props.open}>
            <DialogTitle>Permanent Action!</DialogTitle>
            <DialogContentText ml={5} mr={5} >
                <Typography gutterBottom>
                    Your account will be permanently deleted and cannot be recovered.
                    Are you sure of this action?
                </Typography>
                <DialogActions>
            <Button onClick={props.onClose}>Back</Button>
            <Button onClick={props.onDelete}>Delete</Button>
            </DialogActions>
            </DialogContentText>
        </Dialog>
    )
}