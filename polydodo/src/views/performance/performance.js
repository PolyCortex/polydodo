import React from "react";
import { Container, Row } from "reactstrap";

import Navbar from "../../components/navbar/navbar";
import Header from "../../components/header";
import WIPWarning from "../../components/wip_warning";
import Footer from "../../components/footer/footer";
import D3Component from "../../components/d3component";

import text from "./text.json";
import { createComparativeHypnogram } from "d3/hypnogram/hypnogram";

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
          <WIPWarning />
        </Row>
        <p>Ever wonder what is the value of this application? This page aims to illustrate the relative performance of our sleep scoring compared to clinical hypnogram scoring (which is usually considered the state-of-the-art technique).</p>
        <p><strong>Here is the plan:</strong></p>
        <ul>
          <li>First, we will check how our classifier’s scoring agrees with the scoring within the Physionet's Sleep-EDF dataset. Of course, we will perform this agreement test on a subset of EEG data that was never trained on. This subset is composed of full nights of sleep coming from five subject of a different age group. </li>
          <li>Then, we will check how this classifier performs on a full night recorded on one of our members. In order to be able to make comparisons, we ask for the help of a medical electrophysiologist to score our data. This manual scoring will serve as reference to get an idea of the accuracy of our model on data acquired using an OpenBCI under non-clinical conditions. The AASM manual was used for scoring.</li>
          <li>Finally, we will present the scoring differences between the medical electrophysiologist and Sleep-EDF. To do this, we will take a random night in our dataset. This will allow us to qualify somewhat the previous results and maybe get an idea of the usual disagreement level between professional scorers.</li>
        </ul>
        <h3 className="mt-5">Classifier's accuracy according to Physionet</h3>
        <D3Component callback={createComparativeHypnogram} />
        <h3 className="mt-5">Classifier's accuracy according to the Sleep-EDF</h3>
        <D3Component callback={createComparativeHypnogram} />
        <h3 className="mt-5">Electrophysiologist and Sleep-EDF's agreement</h3>
        <D3Component callback={createComparativeHypnogram} />
      </Container>
      <Footer />
    </div>
  );
};

export default Performance;
