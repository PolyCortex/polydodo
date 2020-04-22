import * as d3 from "d3";

const createHypnogram = (containerNode) => {
    const svg = d3.select(containerNode);
    svg.attr({ width: 500, height: 200 });
    svg.append('rect')
        .attr('x', 10)
        .attr('y', 10)
        .attr('width', 80)
        .attr('height', 80)
        .attr('fill', 'red')
        .transition()
        .duration(10000)
        .attr('x', 10)
        .attr('y', 50)
        .attr('width', 140)
        .attr('height', 80)
        .attr('fill', 'blue');
};

export default createHypnogram