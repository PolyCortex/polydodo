import React from "react";

import {Container, Row} from "reactstrap";

import Navbar from "../../components/navbar/navbar";
import Header from "../../components/header";
import Footer from "../../components/footer/footer";
import Hypnogram from "../../components/hypnogram/hypnogram";

import Placeholder from "../../assets/img/placeholder.png";

import text from "./text.json";

const SleepAnalysis = () => {
  return (
    <div>
      <Navbar />
      <Header
        sizeClass={"pb-150"}
        shapeQty={7}
        title={text["header_title"]}
        subtitle={text["header_subtitle"]}
        description={text["header_description"]}
      />
      <Container className="mt-5 text-justify">
        <p>
          Of course, we are analyzing only one night of sleep so it is therefore tricky to draw general conclusions about your sleep. It is however fascinating to see how your night was.
        </p>
        <p>
          Without further ado, this is what was your night of sleep:
        </p>
        <Row className="justify-content-center">
          <img className="mt-7 mb-7"  width="50%" alt="viz placeholder" src={Placeholder}/>
        </Row>
        <p>
          We have seen that sleep can be decomposed in mainly two stages, whereas REM and NREM, and that we can observe different stage proportions across age, gender and different sleep disorders. We’ve also defined other measures of your sleep architecture, such as your sleep latency, efficiency and total sleep time. In order to improve your sleep hygiene, many elements can be considered:
        </p>
        <ul>
          <li>
            Alimentation: having a balanced diet and avoiding sources of caffeine can have a positive impact on one’s sleep. Chocolate, soft drink, tea and decaffeinated coffee are unexpected sources of caffeine.
          </li>
          <li>
            Routine: going to sleep about at the same time, in a darkened and quiet environment. 
          </li>
        </ul>
        <p>
          Although we’ve looked at many aspects of your night’s sleep, we haven’t properly looked at your sleep dynamics, whereas how your sleep evolves overnight.
        </p>
        <Hypnogram/>
        <p>
          Sleep cycles take place in a broader process, named the circadian rhythm. It is the one that regulates our wake and sleep cycles over a 24 hours period. 
        </p>
        <p>
          You’ve been able to visualize and inspect your night of sleep, which we’ve classified only based on your EEG recordings. In a sleep lab, electrophysiology technicians generally look at your EEG, EOG and submental EMG, and then manually classify each epoch of 30 seconds that compose your night. By looking at your EEG recordings, we can see some patterns that can help electrophysiology technicians, and our classifier, discriminate sleep stages throughout the night.
        </p>
        <Row className="justify-content-center">
          <img className="mt-7 mb-7"  width="50%" alt="viz placeholder" src={Placeholder}/>
        </Row>
      </Container >
      <Footer />
    </div>
  );
}

export default SleepAnalysis;