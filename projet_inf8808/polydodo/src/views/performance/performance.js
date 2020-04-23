import React from "react";
import { Container, Row  } from "reactstrap";

import Navbar from "../../components/navbar/navbar";
import Header from "../../components/header";
import WIPWarning from "../../components/wip_warning";
import Footer from "../../components/footer/footer";
import text from "./text.json";

const Performance = () => {
  return (
    <div>
      <Navbar />
      <Header
        sizeClass={"pb-100"}
        shapeQty={7}
        title={text["header_title"]}
        subtitle={text["header_subtitle"]}
        description={text["header_description"]}
      />
      <Container className="mt-5 text-justify">
        <Row className="mb-5 justify-content-center">
          <WIPWarning/>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Performance;
