import * as d3 from "d3";

export const createMouseOver = (g, margin, width, height) => {
  // 1. Act as a child of `g` to make sure mouse events are received from
  //    the whole chart (not only the lines)
  g.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", 0);

  // 2. Add vertical line that will follow mouse movements
  const lineHover = g.append("line")
    .attr("class", "lineHover")
    .style("stroke", "#999")
    .attr("stroke-width", 2)
    .style("shape-rendering", "crispEdges")
    .style("opacity", 0)
    .attr("y1", height)
    .attr("y2", 0);

  const mouseMove = function() {
    const mouse = d3.mouse(this);

    lineHover.attr("x1", mouse[0])
      .attr("x2", mouse[0])
      .style("opacity", 1);
  };

  const mouseLeave = () => {
    lineHover.style("opacity", 0);
  }

  g.on('mousemove', mouseMove)
    .on('mouseleave', mouseLeave);
};