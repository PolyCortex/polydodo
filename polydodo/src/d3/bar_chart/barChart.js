import * as d3 from "d3";
import { initializeBarChart } from "./initBarChart";

const createBarChart = (countainerNode) => {
    /***** Configuration *****/
    /*** Dimensions ***/
    var margin = {
      top: 100,
      right: 0,
      bottom: 100,
      left: 0
    };
    var canvasWidth = window.innerWidth / 1.9
    var barCanvasHeight = 800
  
    var width = canvasWidth - margin.left - margin.right;
    var barHeight = barCanvasHeight - margin.top - margin.bottom;
  
    /***** Création des éléments *****/
    const svg = d3.select(countainerNode)
    
    svg.attr("width", canvasWidth)
      .attr("height", barCanvasHeight);
    
    var barChart = svg.append("svg")
        .attr("width", canvasWidth)
        .attr("height", barCanvasHeight);
    initializeBarChart(barChart, width, barHeight, margin)
  }

  export default createBarChart
  