import React from "react";
import Announcements from "../components/Announcements";
import Navbar from "../components/Navbar";
import TopButtons from "../components/TopButtons";

function Dashboard() {
  const pages = ["home", "profile", "archive", "potd", "recommendation", "help"];

  return (
    <div className="page-min-height">
      <Navbar useage={pages} />
      <TopButtons />
      <Announcements />
    </div>
  );
}

export default Dashboard;
