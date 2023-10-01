import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Button, Collapse, FormControl, Grid, IconButton, InputLabel, Link, List, ListItem, ListItemText, MenuItem, Stack, Typography } from '@mui/material'
import Select from '@mui/material/Select';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useAuthContext } from "../hooks/useAuthContext";
import Navbar from '../components/Navbar';

const tags = ["any", '2-sat', 'binary search','bitmasks','brute force','combinatorics','constructive algorithms','data structures','dfs and similar','divide and conquer','dp','dsu','expression parsing','fft','flow','games','geometry','graph matchings','graphs','greedy','hashing','implementation','interactive','math','matrices','number theory','probabilities','schedules','shortest paths','sortings','strings','ternary search','trees','two pointers'];

function onlyUnique(value, index, array) 
{
    return array.indexOf(value) === index;
}

function renderTag({tag, handleRemoveTag})
{
    return (
        <Grid item key={Math.random()} sx = {{backgroundColor:"lightblue", m:'5px', p:"3px 10px", borderRadius:"10px"}}>
            {tag}
            <IconButton
                edge = "end"
                aria-label='Delete'
                title="Delete"
                onClick={() => handleRemoveTag(tag)}
            >
                <CancelIcon/>
            </IconButton>
        </Grid>
    );
}

function getColor(type)
{
    if(type === "easy")
        return "#2ad542";
    else if(type === "medium")
        return "orange";
    else
        return "red";
}

function getHoverColor(type)
{
    if(type === "easy")
        return "#17c531";
    else if(type === "medium")
        return "#eb9800";
    else
        return "#da0000";
}

function getLink(problem)
{
    let contestId = "", problemIdx = "";
    let index = 0;
    for(let i = 0; i<problem.length; i++)
    {
        if(problem[i] >= '0' && problem[i] <= '9')
            contestId += problem[i];
        else
        {
            index = i;
            break;
        }
    }

    for(let i = index; i<problem.length; i++)
    {
        problemIdx += problem[i];
    }

    let url = "https://codeforces.com/problemset/problem/" + contestId + "/" + problemIdx;
    return url;
}

function renderProblem(data)
{
    data = data["problem"];
    if(data["problem"] == null)
        return;
        
    return (
        <Grid key={Math.random()} container item sx={{justifyContent:"center"}}> 
            <Link href = {getLink(data["problem"]["id"])} underline = "none" target='_blank'>
                <Button sx = {{backgroundColor:getColor(data["type"]), '&:hover' : {backgroundColor: getHoverColor(data["type"])},color:"white", borderRadius:"10px", p:"3px 10px",m:"10px"}}>
                    <Box sx = {{justifyContent:"center", alignContent:"center", display:"flex"}}>
                        <Grid item sx = {{m:"20px"}}>
                            {data["problem"]["id"]}
                        </Grid>
                        <Grid item sx = {{m:"20px"}}>
                            {data["problem"]["name"]}
                        </Grid>
                        <Grid item sx = {{m:"20px"}}>
                            {data["problem"]["rating"]}
                        </Grid>
                    </Box>
                </Button>
            </Link>
            
        </Grid>
    );
}

export default function Recommendation() {

    const context = useAuthContext();
    const client = axios.create({
        baseURL: "http://localhost:4000/",
        headers: { Authorization: `Bearer ${context.user.token}` },
        withCredentials: "true"
    })

    const [handle, setHandle] = useState(null);
    const [usedTags, setUsedTags] = useState([]);
    const [rating, setRating] = useState(0);
    const [problems, setProblems] = useState([]);

    useEffect(() => {
      client.get(`user/${context.user.id}`).then((res) => {
        setHandle(res.data.handle);
      });
    }, []);

    useEffect(() => {
      if (handle == null) return;
      client
        .post("userdata/rating", {
          user: handle,
        })
        .then((res) => {
          setRating(res["data"]["rating"]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, [handle]);

    async function handleEasyProblem()
    {
        await client
            .post("userdata/problem", {
                rating : rating,
                tags: usedTags,
                lowerBound: -300,
                upperBound: -101
            })
            .then((res) => {
                let temp = res["data"];
                temp["type"] = "easy";
                if(!problems.includes(temp))
                {
                    setProblems((prev) => [...prev, temp]);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    async function handleMediumProblem()
    {
        await client
            .post("userdata/problem", {
                rating : rating,
                tags: usedTags,
                lowerBound: -100,
                upperBound: 100
            })
            .then((res) => {
                let temp = res["data"];
                temp["type"] = "medium";
                if(!problems.includes(temp))
                {
                    setProblems((prev) => [...prev, temp]);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    async function handleHardProblem()
    {
        await client
            .post("userdata/problem", {
                rating : rating,
                tags: usedTags,
                lowerBound: 101,
                upperBound: 300
            })
            .then((res) => {
                let temp = res["data"];
                temp["type"] = "hard";
                if(!problems.includes(temp))
                {
                    setProblems((prev) => [...prev, temp]);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    async function handleAddProblems ()
    {
        setProblems([]);
        for(let i = 0; i<5; i++)
        {
            // console.log(i);
            if(i === 0)
                await handleEasyProblem();
            else if(i === 1 || i === 2)
                await handleMediumProblem();
            else if(i === 3 || i === 4)
                await handleHardProblem();
        };
    }

    const handleAddTag = (tag) => {
        if(!usedTags.includes(tag))
        {
            setUsedTags((prev) => [tag, ...prev]);
        }
    }

    const handleRemoveTag = (tag) => {
        setUsedTags((prev) => [...prev.filter((i) => i !== tag)]);
    };

    const pages = ["home", "profile", "archive", "potd", "help"];

    return (
        <div className='page-min-height'>
        <Navbar useage={pages} />
        <Box
        sx = {{
            flexGrow: 1,
            m : "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }}>
            <Grid
                sx = {{alignContent: "center"}}
                >
                <Typography 
                    align = "center"
                    sx = {{
                        fontFamily: "Lexend Deca",
                        fontWeight: 800,
                        fontSize: "h4.fontSize",
                        color: "#224957",
                        m:"10px"
                    }}
                >
                    Problem Recommendation
                </Typography>
                
                <Box sx = {{display:'flex', justifyContent:"center"}}>
                    <Box sx = {{width:1/2}}>
                        <Grid sx={{justifyContent:"center"}} container>
                            {usedTags.map((tag) => (
                                renderTag({ tag, handleRemoveTag })
                            ))}
                        </Grid>
                    </Box>   
                </Box>

                <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <Box sx = {{width:1/4, m:"10px"}}>
                        <FormControl fullWidth>
                            <InputLabel>Tags</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                defaultValue=""
                                MenuProps={{PaperProps:{sx:{maxHeight: 235}}}}
                            >
                                {tags.map((tag) => (
                                    <MenuItem onClick = {(event) => handleAddTag(event.target.dataset.value)} key={tag} value={tag}>{tag}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>  

                    <Button onClick={handleAddProblems} variant = "contained" sx = {{m : "10px", backgroundColor:"#d529bd", '&:hover' : {backgroundColor: "#b623a1"}}}>
                        Generate
                    </Button> 

                    <Box sx = {{m:"20px", justifyContent:"center"}}>
                        <Grid sx = {{justifyContent:"center"}}>
                            {problems.filter(onlyUnique).map((problem) => (
                                renderProblem({problem})
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Box>
        </div>
        
    )
}
