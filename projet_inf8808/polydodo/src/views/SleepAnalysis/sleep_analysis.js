import React from "react";

import Navbar from "../../components/navbar/navbar.js";
import Header from "../../components/header.js";

const SleepAnalysis = () => {
  return (
    <div>
      <Navbar />
      <Header
        sizeClass={"pb-100"}
        shapeQty={7}
        title="Your Night"
        subtitle="visualized and compared"
        description="We analyzed your night. Scroll down and see what happened."
      />
    </div>
  );
}

export default SleepAnalysis;