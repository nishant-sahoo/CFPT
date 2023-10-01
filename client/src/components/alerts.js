import Alert from '@mui/material/Alert';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';

export default function AlertWithClose(props){
    let [open,setOpen] = useState(true);
  
    return(
        <Collapse in={open}>
    <Alert severity={props.type} onClose={() => {setOpen(false)}}>{props.content}</Alert>
    </Collapse>
    )
  }