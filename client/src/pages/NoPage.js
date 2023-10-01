import React from "react";
import Navbar from "../components/Navbar";

import notFound from "../images/undraw_Not_found_re_bh2e.png";
function NoPage() {
  const pages = ["help"];
  return (
    <div>
      <Navbar useage={pages} />
      <div
        style={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Not Found</h1>
        <img src={notFound} alt="NotFound" width={"40%"} />
      </div>
    </div>
  );
}

export default NoPage;
