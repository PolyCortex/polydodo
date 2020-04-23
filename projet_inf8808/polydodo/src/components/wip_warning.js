import React from "react";
import { Alert } from "reactstrap";
import Emoji from "./emoji";

const WIPWarning = () => {
  return (
    <Alert color="warning">
      <span>
        <Emoji symbol="🚧" />
        <strong> This is a work in progress. </strong>
        The following data is mocked.{" "}
        <Emoji symbol="🚧" />
      </span>
    </Alert >
  );
}

export default WIPWarning;