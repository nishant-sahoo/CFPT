import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";

async function UpdateStandings(eventId) {
  let problems = [];
  console.log("CHECKING");

  console.log(`http://localhost:4000/archive/${eventId}/problems`);

  const res1 = await axios.get(
    `http://localhost:4000/archive/${eventId}/problems`
  );

  console.log("ORIROJGJOROJRGOJ");
  console.log(res1.status);
  problems = res1.data;

  // let res1 = await axios.get(`http://localhost:4000/archive/${eventId}`);
  // console.log(res1.status);
  // res1.allProblems.forEach((problemset) => {
  //   console.log("all PS", res1.allProblems);
  //   problems.push(...problemset.problems);
  // });

  let users = [];
  let res2 = await axios.get(`http://localhost:4000/user/all/`);
  users = res2.data;

  let standing = [];

  for (const user of users) {
    let solves = 0;
    const solvedProblems = user.solvedProblems;

    for (const problem of problems) {
      if (solvedProblems.includes(problem)) {
        ++solves;
        console.log("INCREASE");
      } else {
        console.log("false");
      }
    }

    const newData = {
      userID: user._id,
      name: user.name,
      handle: user.handle,
      rating: user.rating,
      problemsSolved: solves,
    };
    if(solves > 0) standing.push(newData);
  }

  standing.sort((a, b) => {
    if (b.problemsSolved == a.problemsSolved) {
      return b.rating - a.rating;
    } else {
      return b.problemsSolved - a.problemsSolved;
    }
  });

  console.log(standing);

  return standing;
}

export default UpdateStandings;
