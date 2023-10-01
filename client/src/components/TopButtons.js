import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Link from "@mui/material/Link";
import { useAuthContext } from "../hooks/useAuthContext";

function FormButton(info) {
  return (
    <Grid item xs={6} sm={3}>
      <Link href={info.link} underline="none" target={"_blank"}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 100,
            backgroundColor: info.bgColor,
            padding: "4.8%",
            "&:hover": { backgroundColor: info.hoverColor },
          }}
          disabled={info.disabled}
        >
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Lexend Deca",
              fontWeight: 500,
              color: "inherit",
              textDecoration: "none",
              textTransform: "capitalize",
            }}
          >
            <Box>{info.heading}</Box>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                mt: "10px",
                lineHeight: 1,
              }}
            >
              {info.description}
            </Box>
          </Typography>
        </Button>
      </Link>
    </Grid>
  );
}

export default function TopButtons(props) {
  const context = useAuthContext();

  const client = axios.create({
    baseURL: "http://localhost:4000/",
    headers: { Authorization: `Bearer ${context.user.token}` },
    WithCredentials: true,
  });

  //Get the user handle after he's logged in
  const [user, setUser] = useState(null);
  const [reminder, setReminder] = useState("No Contests Nearby!");
  const [totalSolves, setTotalSolves] = useState(0);
  const [problem, setProblem] = useState(
    "https://codeforces.com/contest/4/problem/A"
  );
  const [potd, setPOTD] = useState("/home");

  useEffect(() => {
    client.get(`user/${context.user.id}`).then((res) => {
      setUser(res.data.handle);
    });
  }, []);

  const handleReminderChange = (data) => {
    data = data["result"];
    let n = data.length;
    let currentTime = Date.now() / 1000;
    let timeDiff = 1 * 86400; // 1 day
    for (let i = 0; i < n; i++) {
      let startTime = data[i]["startTimeSeconds"];
      if (startTime - currentTime <= 0) {
        setReminder("No Contests Nearby!");
        return;
      }
      if (startTime - currentTime <= timeDiff) {
        let contestName = data[i]["name"];
        setReminder(contestName);
        return;
      }
    }
  };

  const getUnixTime = (s) => {
    let year = s.substring(0, 4);
    let month = s.substring(5, 7);
    let date = s.substring(8, 10);
    let total = year + "." + month + "." + date;
    let x = Math.floor(new Date(total).getTime() / 1000);
    return x;
  };

  //Here we have used createdAt instead of publishedAt
  const handlePOTDChange = (data) => {
    // data = data["potd"];
    let n = data.length;
    let currentTime = Math.floor(Date.now() / 1000);
    let timeDiff = 1 * 86400; // 1 Day
    for (let i = n - 1; i >= 0; i--) {
      let timePosted = getUnixTime(data[i]["publishedAt"]);
      if (currentTime - timePosted < 0) break;
      if (currentTime - timePosted < timeDiff) {
        setPOTD(data[i]["linkToProblem"]);
        break;
      }
    }
  };

  const handleTotalSolvesChange = (data) => {
    if (data["status"] === "FAILED") return;
    data = data["result"];
    let n = data.length;
    const solvedIds = new Set();
    for (let i = 0; i < n; i++) {
      let problemId =
        data[i]["problem"]["contestId"].toString() +
        data[i]["problem"]["index"];
      if (data[i]["verdict"] === "OK") solvedIds.add(problemId);
    }
    setTotalSolves(solvedIds.size);
  };

  // const computeUserData = () => {
  //     let url = "https://codeforces.com/api/user.status?handle=" + user;
  //     axios.get(url)
  //         .then((res) =>{
  //             let data = res.data;
  //             if(data["status"] === "FAILED")
  //                 return;
  //             data = data["result"];
  //             let n = data.length;
  //             const solvedIds = new Set();
  //             for(let i = 0; i<n; i++)
  //             {
  //                 let problemId = data[i]["problem"]["contestId"].toString() + data[i]["problem"]["index"];
  //                 if(data[i]["verdict"] === "OK" && !solvedIds.has(problemId))
  //                 {
  //                     solvedIds.add(problemId);
  //                     let tags = data[i]["problem"]["tags"];
  //                     tags.forEach(ele => {
  //                         if(userTags.hasOwnProperty(ele))
  //                             userTags[ele] = userTags[ele] + 1;
  //                         else
  //                             userTags[ele] = 1;
  //                     });
  //                 }
  //             }
  //             totalProblems = solvedIds.size;
  //             // console.log(userTags);
  //         })
  // }

  const handleProblemChange = (data) => {
    data = data["problem"];
    let id = data["id"];
    var contestId = 0;
    let idx;
    for (let i = 0; i < id.length; i++) {
      if (!(id[i] >= "0" && id[i] <= "9")) {
        idx = i;
        break;
      }
      contestId = contestId * 10 + (id[i] - "0");
    }

    let index = id.substring(idx, id.length);
    let url =
      "https://codeforces.com/contest/" + contestId + "/problem/" + index;
    console.log(url);
    setProblem(url);
  };

  useEffect(() => {
    axios
      .get("https://codeforces.com/api/contest.list")
      .then((res) => handleReminderChange(res.data));
  }, []);

  useEffect(() => {
    if(user == null) return;
    let url = "https://codeforces.com/api/user.status?handle=" + user;
    axios.get(url).then((res) => handleTotalSolvesChange(res.data));
  }, [user]);

  const getProblem = () => {
    alert("New Problem Recommended");
    client
      .post("recommendation/fetch", {
        user: user,
      })
      .then((res) => {
        handleProblemChange(res.data);
      })
      .catch((e) => {
        console.log("Frontend = " + e);
      });
  };

  // useEffect(() => {
  //     client.post("recommendation/fetch", {
  //         user : user
  //     })
  //     .then((res) => handleProblemChange(res.data));
  // })

  useEffect(() => {
    client.get("potd").then((res) => handlePOTDChange(res.data));
  });

  useEffect(() => {
    if(user == null) return;
    client.post("recommendation/fetch", {
        user : user
    })
    .then((res) => {
        handleProblemChange(res.data);
    })
    .catch((e) => {
        console.log("Frontend = " + e);
    })
},[user])

  return (
    <Box sx={{ flexGrow: 1, mt: "25px", mr: "20px", ml: "20px" }}>
      <Grid container spacing={3}>
        <FormButton
          bgColor="#20DF7F"
          hoverColor="#1ed378"
          heading={props.heading1}
          description="Click Here"
          link={potd}
        />
        <FormButton
          bgColor="#20DFD4"
          hoverColor="#1ed3c9"
          heading={props.heading2}
          description={reminder}
          link="https://codeforces.com/contests"
        />
        <FormButton
          bgColor="#ED4747"
          hoverColor="#eb3333"
          heading={props.heading3}
          description={totalSolves}
          link={`https://codeforces.com/profile/${user}`}
        />
        <FormButton
          bgColor="#812BED"
          hoverColor="#7618eb"
          heading={props.heading4}
          description="Click Here"
          link={problem}
        />
      </Grid>
      <Grid container justifyContent="flex-end" sx={{ mt: "10px" }}>
        <Button
          onClick={getProblem}
          variant="contained"
          endIcon={<SkipNextIcon />}
          sx={{
            backgroundColor: "#812BED",
            "&:hover": { backgroundColor: "#7618eb" },
          }}
        >
          Skip
        </Button>
      </Grid>
    </Box>
  );
}

TopButtons.defaultProps = {
  heading1: "Problem of the Day",
  heading2: "Contest Reminder",
  heading3: "Total Solves",
  heading4: "Recommended Problem",
};
