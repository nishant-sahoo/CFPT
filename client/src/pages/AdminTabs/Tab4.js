import React, { useState, useEffect } from "react";

import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Typography,
  Button,
  Checkbox,
  TableContainer,
  Paper,
  TableHead,
  Table,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import HelpIcon from "@mui/icons-material/Help";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import DeleteIcon from "@mui/icons-material/Delete";

function Tab4() {
  const client = axios.create({
    baseURL: "http://localhost:4000/",
  });

  const [events, setEvents] = useState([]);
  const [menuItems, setItems] = useState([]);
  const [selectValue, setSelectValue] = useState({});
  const [hashTag, setHashTag] = useState({});
  const [accordionData, setData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [ProbLink, setProbLink] = useState("");
  const [AddProblem, setAddProblem] = useState({});
  const [deleteProb, setDeleteProb] = useState({});

  const loadEvents = async () => {
    client
      .get(`create`)
      .then((res) => {
        setEvents(res.data.event);
        // console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const loadTags = async () => {
    client
      .get(`create/tag`)
      .then((res) => {
        // console.log(res);
        res.data.tag.map((value) =>
          setHashTag((prev) => ({
            ...prev,
            [value._id]: value.tag,
          }))
        );

        // console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadEvents();
    loadTags();
  }, []);

  useEffect(() => {
    // console.log(selectValue.allProblems);
    setData([]);

    async function fetchData() {
      //   console.log(selectValue);
      if (Object.keys(selectValue).length !== 0) {
        const data = await Promise.all(
          selectValue.allProblems.map((value) =>
            client.get(`create/ps/${value}`)
          )
        );

        // console.log(data);

        data?.map(async (val) => {
          if (
            val.data.problemset &&
            Object.keys(val.data.problemset).length !== 0
          ) {
            console.log(val.data);

            const prob = await Promise.all(
              val.data.problemset.problems.map((value) =>
                client.get(`create/add/${value}`)
              )
            );
            // console.log(prob);
            let newArr = [];
            if (prob) {
              prob?.map((probs) => newArr.push(probs.data.problem));
            }
            setData((prev) => [
              ...prev,
              {
                title: val.data.problemset.problemSetName,
                _id: val.data.problemset._id,
                content: newArr,
              },
            ]);
          }
        });
      }
    }
    fetchData();
  }, [selectValue]);

  const handleChange = (e, isExpanded, panel) => {
    // if(e.nativeElement.submitter)
    setExpanded(isExpanded ? panel : false);
    setProbLink("");
    setAddProblem({});
  };
  const defaultProps = {
    options: events,
    getOptionLabel: (option) =>
      Object.keys(option).length !== 0 ? option.eventName : "",
    isOptionEqualToValue: (option, value) => {
      if (Object.keys(value).length === 0) {
        return true;
      } else if (value._id === option._id) {
        return true;
      }
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.name === "addPbtn") {
      if (Object.keys(AddProblem).length !== 0) {
        const Prid = e.nativeEvent.submitter.id;
        const res = await client.post(`create/add/${Prid}`, {
          name: AddProblem.name,
          id: AddProblem.contestId + "/" + AddProblem.index,
          rating: AddProblem.rating,
        });

        const tres = await Promise.all(
          AddProblem.tags.map((val) =>
            client.post(`create/tag/${res.data.problem._id}`, {
              tag: val,
            })
          )
        );
        console.log(tres);
        let newProb = {},
          maxi = 0;
        tres.map((val) => {
          if (val.data.problem.tags.length > maxi) {
            maxi = val.data.problem.tags.length;
            newProb = val;
          }
          return val;
        });
        const ind = accordionData.map((e) => e._id).indexOf(Prid);
        // console.log(ind);
        let newArr = accordionData;
        newArr[ind].content.push(newProb.data.problem);
        setData(newArr);
        setProbLink("");
        setAddProblem({});
      }
    } else if (e.nativeEvent.submitter.name === "deletePbtn") {
      console.log(deleteProb);
      const ind = accordionData.map((e) => e._id).indexOf(deleteProb.PSid);
      let newArr = accordionData;
      let newContent = newArr[ind].content.filter(
        (data) => data._id !== deleteProb.cvalue._id
      );
      newArr[ind].content = newContent;
      setData(newArr);
      setDeleteProb({});
      // console.log(res.data);
    }
  };
  const handlePSearch = async () => {
    if (ProbLink) {
      let sep = ProbLink.split("/");
      const len = sep.length;
      const cf_id = parseInt(sep[len - 2]),
        prob_set = sep[len - 1];
      const res = await axios.get(
        "https://codeforces.com/api/problemset.problems"
      );
      //   console.log(res.data.result.problems);
      setAddProblem({});

      res.data.result.problems.map((value) => {
        if (value.contestId === cf_id && value.index === prob_set) {
          setAddProblem(value);
          console.log(value);
        }
        return value;
      });
    }
  };
  return (
    <Box>
      <Box>
        <Autocomplete
          {...defaultProps}
          id="clear-on-escape"
          name="title"
          clearOnEscape
          filterOptions={filterOptions}
          value={selectValue}
          onChange={(e, val) => {
            if (val !== null) {
              setSelectValue(val);
            } else {
              setSelectValue({});
            }
          }}
          sx={{ width: 300 }}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option._id}>
                {option.eventName}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Event" variant="standard" />
          )}
        />
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          {accordionData?.map(({ title, content, _id }, index) => {
            return (
              <Accordion
                name="Accordian"
                expanded={expanded === title}
                onChange={(event, isExpanded) =>
                  handleChange(event, isExpanded, title)
                }
                sx={{
                  mb: 2,
                  backgroundColor: "#224957",
                  color: "#ffffff",
                  width: "100%",
                }}
              >
                <AccordionSummary
                  id={title + "-header"}
                  aria-controls={title + "-content"}
                  expandIcon={
                    <ExpandCircleDownIcon sx={{ color: "secondary.main" }} />
                  }
                  sx={{
                    borderBottom: "8px #20DF7F solid",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "95%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "1.1em", mr: 2, width: "60%" }}>
                      {title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ maxWidth: "700" }}>
                  <TableContainer component={Paper}>
                    <Table
                      stickyHeader
                      aria-label="Problems table"
                      sx={{ width: "100%" }}
                    >
                      <TableHead name="add-problem">
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "0px #224957 solid",
                              width: "100%",
                            }}
                            colSpan={6}
                          >
                            <Box
                              sx={{
                                display: "inline-flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                width: "100%",
                              }}
                            >
                              <TextField
                                key={_id}
                                name={_id}
                                variant="filled"
                                label="Problem Link"
                                value={ProbLink}
                                onChange={(e) => setProbLink(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handlePSearch();
                                  }
                                }}
                                sx={{ width: "50%" }}
                              />

                              <IconButton
                                color="primary"
                                aria-label="add-problem"
                                component="label"
                              >
                                <Button
                                  type="submit"
                                  name="addPbtn"
                                  id={_id}
                                  sx={{ all: "inherit" }}
                                >
                                  <AddCircleIcon />
                                </Button>
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            backgroundColor: "secondary.main",
                            display:
                              Object.keys(AddProblem).length !== 0
                                ? "table-row"
                                : "none",
                          }}
                        >
                          <TableCell
                            sx={{
                              backgroundColor: "secondary.main",
                            }}
                            colSpan={6}
                          >
                            <Grid container>
                              <Grid item xs={4} sx={{ mt: 1 }}>
                                <Button
                                  variant="text"
                                  href={ProbLink}
                                  target="_blank"
                                  sx={{ fontSize: "1em" }}
                                >
                                  {AddProblem.name}
                                </Button>
                                <Typography sx={{ display: "inline", ml: 2 }}>
                                  {AddProblem.rating}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Box
                                  align="center"
                                  sx={{
                                    width: "50%",
                                    display: {
                                      xs: "none",
                                      sm: "none",
                                      md: "inline",
                                      backgroundColor: "#20DF7F",
                                    },
                                  }}
                                >
                                  {Object.keys(AddProblem).length !== 0 &&
                                    AddProblem.tags.map((data) => {
                                      return (
                                        <Button
                                          type="disabled"
                                          sx={{
                                            backgroundColor: "white",
                                            mr: 1,
                                            border: "1px #224957 solid",
                                            mt: 1,
                                            textTransform: "lowercase",
                                            fontSize: "0.9rem",
                                          }}
                                        >
                                          {data}
                                        </Button>
                                      );
                                    })}
                                </Box>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ borderBottom: "2px #224957 solid" }}>
                            Status
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ borderBottom: "2px #224957 solid" }}
                          >
                            Problem
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderBottom: "2px #224957 solid",
                              display: {
                                xs: "none",
                                sm: "none",
                                md: "table-cell",
                              },
                            }}
                          >
                            Tags
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ borderBottom: "2px #224957 solid" }}
                          >
                            <LiveHelpIcon />
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {content?.map((cvalue, cindex) => {
                          //   console.log(cvalue);
                          return (
                            <TableRow
                              key={cvalue._id}
                              sx={{
                                "&:last-child td,&:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              {/* <TableCell>
                            <Checkbox
                              size="medium"
                              defaultChecked={cvalue.status === true}
                              value={isChecked}
                              onChange={(e) => {
                                cvalue.status = !cvalue.status;
                                const newArr = [...accordionData];
                                newArr[index].content[cindex] = cvalue;
                                console.log(newArr);
                                setData(newArr);
                                setChecked(cvalue.status);
                              }}
                              color="primary"
                            />
                          </TableCell> */}
                              <TableCell
                                sx={{ width: "30%", textAlign: "left" }}
                                colSpan={1}
                              >
                                <Button
                                  variant="text"
                                  href={cvalue.id}
                                  target="_blank"
                                  sx={{ fontSize: "1em" }}
                                >
                                  {cvalue.name}
                                </Button>
                              </TableCell>
                              <TableCell align="left">
                                <Typography sx={{ display: "inline" }}>
                                  {cvalue.rating}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="center"
                                sx={{
                                  width: "50%",
                                  display: {
                                    xs: "none",
                                    sm: "none",
                                    md: "inline",
                                  },
                                }}
                              >
                                {cvalue.tags.map((data) => {
                                  return (
                                    <Button
                                      type="disabled"
                                      sx={{
                                        backgroundColor: "#f9f9f9",
                                        mr: 1,
                                        border: "1px #224957 solid",
                                        mt: 1,
                                        textTransform: "lowercase",
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {hashTag[data]}
                                    </Button>
                                  );
                                })}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  color="primary"
                                  aria-label="delete-ps"
                                  component="label"
                                >
                                  <Button
                                    type="submit"
                                    name="deletePbtn"
                                    sx={{ all: "inherit" }}
                                    onClick={(e) =>
                                      setDeleteProb({ cvalue, PSid: _id })
                                    }
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </form>
      </Box>
    </Box>
  );
}

export default Tab4;
