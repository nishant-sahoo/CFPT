import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function DarkModeButton(props){
    return(
        <IconButton onClick={props.onClick} size='large' sx={{position: 'absolute',left:5,bottom:5}} >
        {props.isDarkMode ? 
        <Brightness7Icon fontSize='large'/>
         :<Brightness4Icon fontSize='large'/> }
        </IconButton>
    )
}

export default DarkModeButton;