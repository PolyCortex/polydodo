import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import { Waypoint } from 'react-waypoint';

import D3Component from "../../components/d3component";

import { firstCallback, thirdCallback, fourthCallback } from "../../d3/bar_chart/transition";
import createBarChart from "../../d3/bar_chart/barChart";

const StackedBarChartScrollyTelling = () => {
  return (
    <Container>
      <div style={{ position: "sticky", top: "10%"}}>
        <D3Component callback={createBarChart} />
      </div>
      <div style={{"marginBottom": "50%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>
            We can see that each colored block represents a part of your night. They are ordered from bed time to out of bed timestamps you’ve written in your journal. Each color is associated with a specific sleep stage.
            You went to bed at 12:22 am and you got out of bed at 9:47 am, which adds up to 9 hours and 25 minutes of time spent in bed. Of this total time, you spent 7 hours and 27 minutes actually sleeping.
            You first fell asleep at XX:XX, to which we will refer to as sleep onset. The last non wake block ended at XX:XX, which can also be referred to as sleep offset. During that night's sleep, you went through each of the 5 five stages. Let's try to see a little better what happened about each of them.
          </p>
        </CardBody>
      </Card>
      <div style={{"marginBottom": "125%"}}/>
      <Waypoint onEnter={() => {firstCallback()}} />
      <div style={{"marginBottom": "125%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>
            Wake stage is of course the stage we want to minimize when in bed. It can be decomposed into two parts:
          </p>
          <ul>
            <li> Sleep latency : Time spent before falling asleep, which corresponds to X minutes in your case. </li>
            <li> Wake after sleep onset (WASO): Time spent awake after first falling asleep and before waking up. </li>
            <li> For healthy adults, it is normal to experience small awakenings during the night. Unprovoked awakenings are mostly during or after REM stages. </li>
          </ul>
        </CardBody>
      </Card>
      <div style={{"marginBottom": "125%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>
            <strong>REM stage</strong> stands for “Rapid Eyes Movements” and is also known as “paradoxical sleep”. It is associated with dreaming and, as the National Sleep Foundation says, <strong>“the brain is awake and body paralyzed.”</strong>
          </p>
          <p>
            <strong>N1 stage</strong> is associated with that drowsy feeling before falling asleep. Most people wouldn’t say they fell asleep if they’ve been woken up from N1 sleep.
          </p>
          <p>
            <strong>N2 stage</strong> still corresponds to a light sleep, but where the muscle activity decreases more, and the eyes have stopped moving. It is called, along with N1, <strong>light sleep</strong>.
          </p>
          <p>
            <strong>N3 stage</strong> is when you are deeply asleep, hence it’s also called <strong>deep sleep</strong>, or sometimes <strong>slow wave</strong> sleep, and is the most difficult to wake up from. It is during those stages that your cells get repaired, and that tissue grows. But how much time did you spend in each stage during the whole night?
          </p>
        </CardBody>
      </Card>
      <div style={{"marginBottom": "125%"}}/>
      <Waypoint onEnter={() => {thirdCallback()}} />
      <div style={{"marginBottom": "125%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>
            From here, we can look at your sleep efficiency, which is the proportion of time spent asleep over the overall time spent in bed. In your case, it corresponds to 79%, or 7h27.
          </p>
        </CardBody>
      </Card>
      <div style={{"marginBottom": "125%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>
            We are currently looking at your in bed sleep stage proportions. Wake time may be overrepresented, because it includes your sleep latency and the time you spent in bed after waking up. In order to look at your actual stage proportions, we must cut them out from wake time to only keep WASO.
          </p>
        </CardBody>
      </Card>
      <div style={{"marginBottom": "125%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>
            We can see that the most prominent sleep stage is N2, which in your case corresponds to XXXX. How does your night compare to other people’s night?
          </p>
        </CardBody>
      </Card>
      <div style={{"marginBottom": "125%"}}/>
      <Waypoint onEnter={() => {fourthCallback()}} />
      <div style={{"marginBottom": "125%"}}/>
      <Card className="shadow"  style={{ position: "relative"}}>
        <CardBody>
          <p>As a rule of thumb, adults approximately stay 5% of their total sleep time in N1; 50% in N2; and 20% is in N3. The remaining 25% is REM stage sleep.</p>
          <p> By comparing your stage proportions with the nights within our dataset, we’ve found that the subject’s night that most corresponds is of a woman aged XX years old.</p>
        </CardBody>
      </Card>
      <div style={{"marginBottom": "125%"}}/>
      .{/*For now, don't touch this dot!!!*/}
    </Container>
  );
};

export default StackedBarChartScrollyTelling;