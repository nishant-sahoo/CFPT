import React, { useState, useEffect } from "react";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Fab from "@mui/material/Fab";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Zoom from "@mui/material/Zoom";

function ScrollTop(props) {
  const { children, window } = props;

  // Use useScrollTrigger to trigger the scroll event
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  // Function to handle the scroll event
  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Render the ArrowUpwardIcon and Fab components
  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <ArrowUpwardIcon />
        </Fab>
      </div>
    </Zoom>
  );
}
export default ScrollTop;
