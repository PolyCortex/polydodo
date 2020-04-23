import * as d3 from "d3";
import { initializeBarChart } from "./initBarChart";

const createBarChart = (countainerNode) => {
    /***** Configuration *****/
    /*** Dimensions ***/
    var margin = {
      top: 100,
      right: 150,
      bottom: 100,
      left: 100
    };
    var canvasWidth = window.innerWidth
    var barCanvasHeight = 800
  
    var width = canvasWidth - margin.left - margin.right;
    var barHeight = barCanvasHeight - margin.top - margin.bottom;
  
    /***** Création des éléments *****/
    const svgg = d3.select(countainerNode)
    
    svgg.attr("width", canvasWidth)
      .attr("height", barCanvasHeight);
    
    var barChart = svgg.append("svg")
        .attr("width", canvasWidth)
        .attr("height", barCanvasHeight);
    console.log(svgg);
    initializeBarChart(barChart, width, barHeight, margin)
  }

  export default createBarChart
  