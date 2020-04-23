import * as d3 from "d3";
import { initializeBarChart } from "./initBarChart";

const createBarChart = (countainerNode) => {
    /***** Configuration *****/
    /*** Dimensions ***/
    const margin = {
      top: 100,
      right: 70,
      bottom: 50,
      left: 70
    };

    var canvasWidth = 1000
    var barCanvasHeight = 600
  
    var width = canvasWidth - margin.left - margin.right;
    var barHeight = barCanvasHeight - margin.top - margin.bottom;
  
    /***** Création des éléments *****/
    const svg = d3.select(countainerNode)
    
    svg.attr("width", canvasWidth)
      .attr("height", barCanvasHeight);
    
    var barChart = svg.append("svg")
        .attr("width", canvasWidth)
        .attr("height", barCanvasHeight);

    return initializeBarChart(barChart, width, barHeight, margin);
  }

  export default createBarChart
  