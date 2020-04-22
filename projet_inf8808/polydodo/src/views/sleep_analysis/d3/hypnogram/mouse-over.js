import * as d3 from "d3";

const getHoveredData = (data, x, mouse, bisectTime) => {
  const currentTimeDate = x.invert(mouse[0]);
  const idx = bisectTime(data, currentTimeDate, 1);
  const currentTimeDateEpoch = currentTimeDate - data[idx - 1].timestamp > data[idx].timestamp - currentTimeDate
    ? data[idx].timestamp
    : data[idx - 1].timestamp;

  return {
    "timestamp": currentTimeDateEpoch
  };
};

export const createMouseOver = (g, x, data, margin, width, height, dateFormat) => {
  const bisectTime = d3.bisector(d => d.timestamp).left; // https://github.com/d3/d3-array#bisector_left

  // 1. Act as a child of `g` to make sure mouse events are received from
  //    the whole chart (not only the lines)
  g.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", 0);

  // 2.1 Add vertical line that will follow mouse movements
  const lineHover = g.append("line")
    .attr("class", "lineHover")
    .attr("y1", height)
    .attr("y2", 0)
    .attr("stroke-width", 1)
    .style("stroke", "#999")
    .style("shape-rendering", "crispEdges")
    .style("opacity", 0);

  // 2.2 Add text to show hover hour
  const dateHover = g.append("text")
    .attr("class", "lineHoverDate")
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .style("opacity", 0);

  const mouseMove = function () {
    const mouse = d3.mouse(this);
    const { timestamp } = getHoveredData(data, x, mouse, bisectTime);

    lineHover.attr("x1", mouse[0])
      .attr("x2", mouse[0])
      .style("opacity", 1);

    dateHover.text(dateFormat(timestamp))
      .attr("transform", `translate(${x(timestamp)},${height + margin.bottom - 10})`)
      .style("opacity", 1);
  };

  const mouseLeave = () => {
    lineHover.style("opacity", 0);
    dateHover.style("opacity", 0);
  }

  g.on('mousemove', mouseMove)
    .on('mouseleave', mouseLeave);
};