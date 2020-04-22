"use strict";

function addTransitions(g, canvas, sources, x, y, color, height, barHeight, width, tipStacked, xAxis, yAxis, firstStageIndex, totalStagePortion){
  
    g.selectAll(".rect-stacked")
        .on("click", () => firstTransition(g,sources,xAxis,yAxis,height,color))

    canvas.append("rect")
        .attr("x", 340)
        .attr("y", 10)
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", "white")
        .attr("transform", "translate(" + 100 + "," + 10 + ")")
        .on("click",() => secondTransition(g, sources, xAxis, yAxis, height, color));

    canvas.append("rect")
        .attr("x", 340)
        .attr("y", 10)
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", "#e6521c")
        .attr("transform", "translate(" + 140 + "," + 10 + ")")
        .on("click", () => thirdTransition(g,sources,firstStageIndex,totalStagePortion, width, height, xAxis, x, tipStacked));

    canvas.append("rect")
        .attr("x", 340)
        .attr("y", 10)
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", "#ffdcff")
        .attr("transform", "translate(" + 180 + "," + 10 + ")")
        .on("click", () => {
            d3.select(".d3-tip").remove()
            fourthTransition(g,sources,x,firstStageIndex,totalStagePortion,width, barHeight);
        });
}
  
/**
 * Réalise une transition entre les données actuellement utilisées et les nouvelles qui doivent être utilisées.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles est dessiné.
 * @param data    Les nouvelles données à utiliser.
 * @param x       L'échelle pour l'axe X.
 * @param y       L'échelle pour l'axe Y.
 * @param r       L'échelle pour le rayon des cercles.
 */
function firstTransition(g, data, xAxis, yAxis, height, color) {

  g.selectAll(".y.axis").remove();
    //create Y axes
    g.append("g")
      .data(data)
      .transition()
      .attr("class", "y axis")
      .duration(2000)
      .call(yAxis)
      .selectAll("text")//The left labels with different colors in Y axes 
        .attr("class","y-label")
        .attr("y", height/2)  
        .attr("x", -10)
        .style('fill', function(d,i) { 
          return color(d);
        })
        .style("font-size", "20px")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
       
    //Move every sleep stage portion to the correspending stage row
    g.selectAll(".rect-stacked")
      .transition()
      .duration(2000)
        .attr("y", function(d,i){
          return height*d.stage;
        })
        .attr("height", height)
    
    //Move X axes
    g.select(".x.axis").transition()
      .attr("transform", "translate(0," + (height*5) + ")")
      .duration(2000)
      .call(xAxis);
      
  }

function secondTransition(g, data, xAxis, yAxis, height, color) {

  var newHeight = height/10
  g.selectAll(".rect-stacked")
    .transition()
    .duration(2000)
      .attr("y", function(d,i){
        return height*d.stage;
      })
      .attr("height", newHeight);

  g.select(".y.axis")
    .transition()
    .duration(2000)
    .attr("transform", "translate(0," + (0) + ")")
    .call(yAxis)
    .selectAll(".y-label")//The left labels with different colors in Y axes 
      .attr("y", newHeight/2)
      .attr("x", -10)

}


//Third data vizualisation
function thirdTransition(g, data, firstIndexes, totalStagePortion, width, height, xAxis, x, tip) {
  
  var endHour = data[data.length - 1].currentStageEnd.getHours() + (data[data.length - 1].currentStageEnd.getMinutes()/60 );
  var startHour = data[0].currentStageDebut.getHours() + (data[0].currentStageDebut.getMinutes()/60 );
  var sleepTotal = endHour - startHour

  x.domain([0, sleepTotal])
  var array = []
  for (let currentTick = 0; currentTick < sleepTotal; currentTick++) {
    array.push(currentTick);
  }
  xAxis.tickFormat(d => d + " h")
        .tickValues(array)

  g.select(".x.axis").transition()
    .call(xAxis)
    //.call(x)
    .duration(2000)

  //Move all part to the left and make the first bar of each row become the cumulative portion of the stage 
  g.selectAll(".rect-stacked")
    .on("mouseover", function(d, i) {
      tip.show(d);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout",function(d){
      tip.hide();
      d3.select(this).style("opacity", 1);
    }) 
    .transition()
    .attr("x", 0)
    .attr("width", function (d,i) {
        if(i === firstIndexes[d.stage]) return totalStagePortion[d.stage]*width;
        else return 0;
    })
    .duration(2000)

  //text containing the % of the sleep stage on the bar
  g.selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class","pourc")
    .text(function(d,i) {
        var rounded = Math.round(totalStagePortion[d.stage]*100 * 10) / 10
        if(i === firstIndexes[d.stage]) return rounded + "%";
        else return "";
      })
      .attr("x", width/20)
      .attr("y", function(d,i) {; 
        return (height*d.stage) + height/2;// TO DO USE FUNCTON
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
  
    // d3.select(".x.axis").remove()
}
  
function fourthTransition(g, data, x, firstIndexes, totalStagePortion, width, height) {
  
  g.selectAll(".rect-stacked")
    .transition()
    .duration(2000)
    .attr("x", function(d,i){
      var cumul = 0;
      for (let index = 0; index < d.stage; index++) {
        cumul += totalStagePortion[index];
      }
      return cumul*width;
    })
    .transition()
    .duration(2000)
    .attr("y", function(d,i){
      if(i === firstIndexes[d.stage]) return 0;
    })
    .transition()
    .duration(1000)
    .attr("height", height)
    
  g.selectAll(".y.axis").remove();

  g.select(".x.axis").transition()
  .attr("transform", "translate(0," + (height) + ")")
  .duration(5000);

  g.selectAll(".pourc")
    .transition()
    .duration(5000)
    .attr("x", function(d, i) {
      var cumul = totalStagePortion[d.stage]/2
      for (let index = 0; index < d.stage; index++) {
        cumul += totalStagePortion[index];
      }
      return cumul*width;
    })
    .attr("y", function(d,i) {
      if(i === firstIndexes[d.stage]) return height/2;
    })
}
