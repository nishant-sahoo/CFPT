import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
  CircularProgress,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import HelpIcon from "@mui/icons-material/Help";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import { DialogBox } from "../components/DialogBox";
import Testing from "../components/Testing";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation } from "react-router-dom";
function ProblemSet() {
  const { user } = useAuthContext();

  let location = useLocation();

  const event_id = location.pathname.split("/").pop();
  const client = axios.create({
    baseURL: "http://localhost:4000/",
    WithCredentials: true,
    headers: { Authorization: `Bearer ${user.token}` },
  });

  const pages = ["home", "profile", "archive", "potd", "help"];

  const [progress, setProgress] = useState(0);
  const [tot, setTot] = useState(0);

  const [expanded, setExpanded] = useState(false);
  const [ptitle, setPtitle] = useState("");
  const [events, setEvent] = useState({});
  const [loading, setLoading] = useState(true);

  const [isChecked, setChecked] = useState(false);
  const [hashTag, setHashTag] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [diaValue, setDiaValue] = useState("false");

  const handleOpenDialog = (dcontent) => {
    setOpenDialog(true);
    console.log(dcontent);
    setDiaValue(dcontent);
  };
  const handleChange = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [psData, setPsData] = useState([]);
  const [accordionData, setData] = useState([]);

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

  const loadEvent = async () => {
    try {
      const eventResponse = await client.get(`create/${event_id}`);
      setData([]);
      // console.log(res.data.event);
      setPtitle(eventResponse.data.event.eventName);
      // setEvent(res.data.event);
      const eventData = eventResponse.data;
      console.log(eventData.event.allProblems);

      if (Object.keys(eventData).length !== 0) {
        const problemSetIds = eventData.event.allProblems;
        // console.log(eventData);
        const problemSetResponses = await Promise.all(
          problemSetIds.map((problemSetId) =>
            client.get(`create/ps/${problemSetId}`)
          )
        );
        const problemSets = problemSetResponses.map(
          (response) => response.data
        );
        console.log(problemSets);

        const problemIds = problemSets.reduce(
          (acc, problemSet) => [...acc, ...problemSet.problemset.problems],
          []
        );

        const problemResponses = await Promise.all(
          problemIds.map((problemId) => client.get(`create/add/${problemId}`))
        );
        const problems = problemResponses.map((response) => response.data);
        console.log(problems);

        // console.log(psData);

        // console.log(data);
        problems.map((value) => {
          const status = value.problem.peopleSolved.includes(user.id);
          value.problem.status = status;
          const marked = value.problem.peopleMarked.includes(user.id);
          value.problem.marked = marked;
        });
        // console.log(content);
        problemSets.sort(
          (a, b) => a.problemset.problemSetName <= b.problemset.problemSetName
        );
        setData(
          problemSets.map((problemSet) => ({
            title: problemSet.problemset.problemSetName,
            content: problems
              .filter((problem) =>
                problemSet.problemset.problems.includes(problem.problem._id)
              )
              .map((res) => res.problem)
              .sort((a, b) => a.rating - b.rating),
          }))
        );
        setLoading(false);
      }
      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (Object.keys(events).length === 0) {
      loadEvent();
    }
    loadTags();
  }, []);

  useEffect(() => {
    // console.log(accordionData);
    const prog = accordionData.reduce(
      (acc, obj) =>
        acc + obj.content.filter((data) => data.status === true).length,
      0
    );
    const total = accordionData.reduce(
      (acc, obj) => acc + obj.content.length,
      0
    );
    setProgress(prog);
    setTot(total);
  }, [accordionData]);

  const sidTo = {
    pathname: `/standing/${event_id}`,
  };

  return (
    <div className="page-min-height">
      <Navbar useage={pages} />
      <Container maxWidth="xl" sx={{ my: 4 }}>
        {/* <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 3, height: 10, borderRadius: 2 }}
        /> */}

        <Box
          flexShrink={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            maxWidth: 1100,
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            {ptitle}
          </Typography>
          <Link to={sidTo} style={{ textDecoration: "none" }}>
            <Button>Standings</Button>
          </Link>
          <Typography variant="h6">
            {progress}/{tot}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={(progress * 100) / tot}
            sx={{ mb: 5, mt: 1, height: 10, width: "80%", borderRadius: 2 }}
          />
          {loading ? <CircularProgress /> : <></>}
          {accordionData?.map(({ title, content }, index) => {
            let solved = (content?.filter(
              (data) => data.status === true
            )).length;
            let total = content?.length;
            return (
              <Accordion
                expanded={expanded === title}
                onChange={(event, isExpanded) =>
                  handleChange(isExpanded, title)
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

                    <Typography sx={{ fontSize: "1.1em", mr: 2 }}>
                      {solved}/{total}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(solved * 100) / total}
                      sx={{
                        mb: 2,
                        mt: 2,
                        height: 10,
                        width: "76%",
                        borderRadius: 2,
                        backgroundColor: "white",
                      }}
                      color="secondary"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ maxWidth: "700" }}>
                  <TableContainer component={Paper}>
                    <Table
                      stickyHeader
                      aria-label="Problems table"
                      sx={{ width: "100%" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ borderBottom: "2px #224957 solid" }}>
                            Bookmark
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
                            }}
                          >
                            Ratings
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {content?.map((cvalue, cindex) => {
                          console.log(cvalue);
                          console.log(cindex);
                          return (
                            <TableRow
                              key={content.id}
                              sx={{
                                "&:last-child td,&:last-child th": {
                                  border: 0,
                                },
                                backgroundColor: cvalue.status
                                  ? "#20DF7F"
                                  : cvalue.marked
                                  ? "#FFD700"
                                  : "",
                              }}
                            >
                              <TableCell>
                                <Checkbox
                                  size="medium"
                                  defaultChecked={cvalue.marked === true}
                                  value={isChecked}
                                  onChange={async (e) => {
                                    cvalue.marked = !cvalue.marked;
                                    const newArr = [...accordionData];
                                    newArr[index].content[cindex] = cvalue;
                                    console.log(newArr);
                                    setData(newArr);
                                    setChecked(cvalue.marked);

                                    try {
                                      const res = await axios.post(
                                        `http://localhost:4000/problem/flipMarked`,
                                        {
                                          problemId: cvalue._id,
                                          userId: user.id,
                                        }
                                      );
                                      console.log(res.data);
                                    } catch (error) {
                                      console.error(error);
                                    }
                                  }}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ width: "35%" }}>
                                <Button
                                  variant="text"
                                  href={
                                    "https://codeforces.com/problemset/problem/" +
                                    cvalue.id
                                  }
                                  target="_blank"
                                  sx={{ fontSize: "1em" }}
                                >
                                  {cvalue.name}
                                </Button>
                              </TableCell>

                              <TableCell align="center">
                                <Typography
                                  sx={{ display: "inline", fontWeight: 800 }}
                                  color="primary"
                                >
                                  {cvalue.rating}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="right"
                                sx={{
                                  display: {
                                    xs: "none",
                                    sm: "none",
                                    md: "inline",
                                  },
                                  display: "flex",
                                  justifyContent: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                {cvalue.tags.map((data) => (
                                  <Button
                                    type="disabled"
                                    sx={{
                                      backgroundColor: "#f9f9f9",
                                      ml: 1,
                                      border: "1px #224957 solid",
                                      mt: 1,
                                      textTransform: "lowercase",
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    {hashTag[data]}
                                  </Button>
                                ))}
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
        </Box>
      </Container>
    </div>
  );
}

export default ProblemSet;
