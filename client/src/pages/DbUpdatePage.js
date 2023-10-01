import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Typography } from "@mui/material";
import axios from "axios";

async function updateFunc(userId, pid) {
  //push the problem to solvedProblems of user
  const res1 = await axios.post(`http://localhost:4000/user/addProblem`, {
    problemId: pid,
    userId: userId,
  });
  console.log("Prob has been added SUCCESSFULLY");

  //push the user to peopleSolved of problem
  const res2 = await axios.post(`http://localhost:4000/problem/addSolved`, {
    problemId: pid,
    userId: userId,
  });
  console.log("User has been added SUCCESSFULLY");
}

let lastCalled = null;

async function UpdateDB() {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let allProblems = null;
  let allUsers = null;

  const response1 = await axios.get(`http://localhost:4000/user/all/`);

  if (response1.status == 200) {
    allUsers = response1.data;
    console.log("allUsers");
    console.log(allUsers);
  }

  const response2 = await axios.get(`http://localhost:4000/problem/`);

  if (response2.status == 200) {
    allProblems = response2.data;
    console.log("allProbs");
    console.log(allProblems);
  }

  let mapp = new Map(); //Key: UserId ; Value: List of unSolved ProbId
  let cnt = 0;
  for (const user of allUsers) {
    let updProb = [];
    console.log(cnt);
    ++cnt;
    for (const problem of allProblems) {
      if (user.solvedProblems.includes(problem._id));
      else updProb.push(problem);
    }
    mapp.set(user, updProb);
  }
  console.log(mapp);

  let cfApiData = new Map();
  for (const user of allUsers) {
    console.log(user.name);
    let handle = user.handle;

    let currentTime = new Date();

    while (currentTime - lastCalled <= 2100 && lastCalled != null) {
      currentTime = new Date();
    }

    let data = null;

    if (lastCalled == null || currentTime - lastCalled > 2100) {
      let url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5000`;
      try {
        const res = await axios.get(url);
        if (res.status === 200) {
          data = res.data.result;
        } else {
          console.log("Couldn't Fetch Data");
        }
        lastCalled = new Date();
        console.log("call");
      } catch (error) {
        console.log("Axios GET request failed:", error);
      }
    }

    if (data == null) continue;
    if (data.length == 0) continue;
    let dataList = [];

    for (let k = 0; k < data.length; k++) {
      let problemIndex = data[k].problem.index;
      let verdict = data[k].verdict;
      let tests = data[k].testset;
      let probId = data[k].contestId + "/" + problemIndex;

      if (verdict === "OK" && tests === "TESTS") {
        dataList.push(probId);
      }
    }
    cfApiData.set(user._id, dataList);
  }
  console.log("Data from CF API");
  console.log(cfApiData);

  let needUpdate = new Map(); //<userId, list of probs>
  for (const [user, problemList] of mapp) {
    let handle = user.handle;
    let pidList = [];
    const CFdata = cfApiData.get(user._id);
    for (const problem of problemList) {
      let probId = problem.id;
      if (CFdata.includes(probId)) pidList.push(problem._id);
    }
    needUpdate.set(user._id, pidList);
  }
  console.log(needUpdate);

  for (const [userId, pidList] of needUpdate) {
    for (const pid of pidList) {
      await updateFunc(userId, pid);
    }
  }
  console.log("DataBase Updated");

  //update rating of users
  await updateRating(allUsers);
}

async function updateRating(allUsers) {
  let handleApiUrl = "https://codeforces.com/api/user.info?handles=";
  let allhandles = "";
  let calledUsers = [];
  for (const user of allUsers) {
    let handle = user.handle;

    if (handle == null) continue;

    if (calledUsers.length > 0) allhandles += ";";
    allhandles += handle;
    calledUsers.push(user._id);
  }
  console.log(handleApiUrl + allhandles);

  handleApiUrl += allhandles;

  let cnt = 0;
  const res = await axios.get(handleApiUrl);
  lastCalled = new Date();

  while (cnt < calledUsers.length) {
    if (res.status == 200) {
      const rating = res.data.result[cnt].rating;
      const intRating = parseInt(rating, 10);
      const response = await axios.post(`http://localhost:4000/user/rating`, {
        id: calledUsers[cnt],
        rating: intRating,
      });
    } else {
      console.log("Couldn't Fetch Data");
    }

    ++cnt;
  }

  console.log("Ratings Updated");
}

function DbUpdatePage() {
  const pages = ["admin", "dbUpdate", "potd", "archive", "help"];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await callOnce();

        // Set isLoading to false when data is loaded
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const callOnce = async () => {
    await UpdateDB();
    return new Promise((resolve) => {
      setTimeout(resolve, 2000); // Simulating a 2-second delay
    });
  };

  return (
    <div className="page-min-height">
      <Navbar useage={pages} />
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "primary.main",
          marginLeft: "25vw",
        }}
      >
        {isLoading ? (
          <>
            <p>Please Wait...</p>
            <p> DataBase is being updated </p>
          </>
        ) : (
          <p>DataBase has been updated Successfully</p>
        )}
      </Typography>
    </div>
  );
}

export default DbUpdatePage;
