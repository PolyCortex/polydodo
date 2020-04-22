import * as d3 from "d3";

export const createLine = (x, y) => {
  return d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.sleep_stage))
    .curve(d3.curveStepAfter);
};

const createGradient = (g, y, id) => {
  // See example here: https://bl.ocks.org/d3noob/d3a22ef27b253ab8d49e97699a8e84b1
  const label_colors = {
    'W': "#E3624B",
    'REM': "#FFD443",
    'N1': "#B0C9D9",
    'N2': "#4da6fe",
    'N3': "#48587f",
  };
  const gradient_stop_data = [								
    {offset: "0%", stage: 'W'},	
    {offset: "25%", stage: 'REM'},
    {offset: "50%", stage: 'N1'},	
    {offset: "75%", stage: 'N2'},	
    {offset: "100%", stage: 'N3'}
  ];

  g.append("linearGradient")
      .attr("id", id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%").attr("y1", y('W'))
      .attr("x2", "0%").attr("y2", y('N3'))
    .selectAll("stop")						
      .data(gradient_stop_data)					
    .enter().append("stop")			
      .attr("offset", d => d.offset)	
      .attr("stop-color", d => label_colors[d.stage]);
}

export const createHypnogramChart = (g, data, line, y) => {
  const gradientId = "sleep-stage-hypnogram-gradient"

  createGradient(g, y, gradientId);

  g.append("path")
      .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", x => line(x))
    .attr("stroke", `url(#${gradientId})`)
    .attr("stroke-width", 2);
};
