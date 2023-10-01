import React from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import StandingTable from "../components/StandingTable";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

function Standings() {
  const { user } = useAuthContext();

  let pages = ["home", "profile", "archive", "potd", "help"];
  if (user.role === "Admin") { pages = ["admin", "dbUpdate", "potd", "archive", "help"]; }

  let location = useLocation();
  const event_id = location.pathname.split("/").pop();

  const [event, setEvent] = useState(null);
  const [userinfo, setUserinfo] = useState(null);
  const [problems, setProblems] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Hello")
        const response = await axios.get(
          `http://localhost:4000/standing/event/find/${event_id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );


        if(response.status == 200)
        {
          console.log(response.data)
          // setEvent(response.data.event);
          setUserinfo(response.data.userinfo);
          // setProblems(response.data.problems);

        }
    };
    // fetchData();

    console.log(event)
    console.log(userinfo)
    console.log(problems)
  }, []);

  return (
    <div className="page-min-height">
      <Navbar useage={pages} />
      <StandingTable event={event_id} key={event_id} />
    </div>
  );
}

export default Standings;
