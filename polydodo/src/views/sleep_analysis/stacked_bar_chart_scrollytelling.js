import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import { Waypoint } from 'react-waypoint';

import D3Component from "../../components/d3component";

import { firstCallback } from "../../d3/bar_chart/transition";
import createBarChart from "../../d3/bar_chart/barChart";

const StackedBarChartScrollyTelling = () => {
  return (
    <Container>
      <div style={{ position: "sticky", top: "5%", "z-index": -1}}>
        <D3Component callback={createBarChart} />
      </div>
      <div style={{"margin-bottom": "25%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>
            We can see that each colored block represents a part of your night. They are ordered from bed time to out of bed timestamps you’ve written in your journal. Each color is associated with a specific sleep stage.
            You went to bed at 12:22 am and you got out of bed at 9:47 am, which adds up to 9 hours and 25 minutes of time spent in bed. Of this total time, you spent 7 hours and 27 minutes actually sleeping.
            You first fell asleep at XX:XX, to which we will refer to as sleep onset. The last non wake block ended at XX:XX, which can also be referred to as sleep offset. During that night's sleep, you went through each of the 5 five stages. Let's try to see a little better what happened about each of them.
          </p>
        </CardBody>
      </Card>
      <div style={{"margin-bottom": "100%"}}/>
      <Waypoint onEnter={() => {firstCallback()}} />
      <div style={{"margin-bottom": "100%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>
            Wake stage is of course the stage we want to minimize when in bed. It can be decomposed into two parts:
            <ul>
              <li> Sleep latency : Time spent before falling asleep, which corresponds to X minutes in your case. </li>
              <li> Wake after sleep onset (WASO): Time spent awake after first falling asleep and before waking up. </li>
              <li> For healthy adults, it is normal to experience small awakenings during the night. Unprovoked awakenings are mostly during or after REM stages. </li>
            </ul>
          </p>
        </CardBody>
      </Card>
      <div style={{"margin-bottom": "100%"}}/>
    </Container>
  );
};

export default StackedBarChartScrollyTelling;