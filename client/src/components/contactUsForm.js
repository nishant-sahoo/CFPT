import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import { useState } from "react"
import axios from 'axios';
import Typography from "@mui/material/Typography";


const initialFValues = {
    fullName : '',
    email : '',
    contactNumber : '',
    description : ''
}

export default function ContactUsForm(props){

    const [values,setValues] = useState(initialFValues);

    const client = axios.create({
        baseURL: "http://localhost:4000/",
    });

    let sendFeedback = async function(message){
        let {data} = await client.post('/help/send',message);
        return data
    }
    
    

    const  handleInputChange = (e) => {
        // e.preventDefault();
        const {name,value} = e.target;
        setValues({
            ...values,
            [name] : value
        })
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        //validate
        sendFeedback(values).then((res)=>{
            console.log(res);
            if(res === 'Message sent succesfully!'){
                setValues(initialFValues);
            }else{
                console.log(res);
            }
        });
        
    }
    // validate contact number

    return(
        <form sx={{pt:4,pr:2}} method='post' autoComplete="off" onSubmit={handleSubmit}>
        <FormControl  margin="dense" className="myform">
        
            <TextField 
            sx ={ {m: 1,width : {sx: 300, sm : 450},input:{color:'white'}}}
            value={values.fullName} autoFocus
            name='fullName' label={<Typography sx={{ color: "#20DF7F" }}>Name</Typography>} 
            onChange={handleInputChange}
            />
            <TextField 

            sx ={ {m : 1,width : {sx: 300, sm : 450},input:{color:'white'}}} type="email"
                label={<Typography sx={{ color: "#20DF7F" }}>Email</Typography>} 
                name="email" value={values.email} onChange={handleInputChange}
            />
            <TextField 
            sx ={ {m : 1,width : {sx: 300, sm : 450},input:{color:'white'}}} 
                label={<Typography sx={{ color: "#20DF7F" }}>Contact Number</Typography>} 
                name='contactNumber' value={values.contactNumber} pattern="/(7|8|9)\d{9}/" onChange={handleInputChange}
            />
            <TextField
            sx ={ {m : 1,width : {sx: 300, sm : 450},textarea:{color:'white'}}}
            label={<Typography sx={{ color: "#20DF7F" }}>Description</Typography>} 
                name="description" value={values.description} onChange={handleInputChange}
                multiline minRows={3}
            />
            <Button sx={{pr:1,m: 1, width: {sx: 300, sm :450},fontSize: 18}}
             variant = "contained"  type="submit">
            Submit</Button>
        </FormControl>
        </form>
    )
}


// Alternative style for white text-background for light theme:
// '.MuiOutlinedInput-input':{
//     background:'#4E6D78',
//     borderRadius:'5px',
// }, padding:1