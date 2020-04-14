"use strict";

/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createStackedBarChart(g,sources, x, y, color, height, width, tip, xAxisFocus, yAxisFocus, firstStageIndex, totalStagePortion) {
  //Creating all the parts of the stacked bar chart
  g.selectAll(".rect")
    .data(sources)
    .enter()
    .append("rect")
      .attr("class", "rect-stacked")
      .attr("x", function (d) {
        return x(d.currentStageDebut);
      })
      .attr("y", function (d) {
        return 0;
      })
      .attr("width", function (d) {
        return x(d.currentStageEnd) - x(d.currentStageDebut);
      })
      .attr("height", 200)
      .attr("fill", function(d) { 
        return color(d.stage); 
      }).on("mouseover", function(d, i) {
        tip.show(d);
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseout",function(d){
        tip.hide();
        d3.select(this).style("opacity", 1);
      }) 
      .on("click", function(d){
        firstTransition(g,sources,xAxisFocus,yAxisFocus,height,color);
      })

  
    d3.select("svg")
    .append("rect")
      .attr("x", 340)
      .attr("y", 10)
      .attr("width", 30)
      .attr("height", 30)
      //.style('stroke', "#ffffff")
      .style("fill", "#e6521c")
      .attr("transform", "translate(" + 140 + "," + 10 + ")")
      .on("click", function(d){
        d3.select(".d3-tip").remove()
        secondTransition(g,sources,firstStageIndex,totalStagePortion,width);
    });
  

  d3.select("svg")
    .append("rect")
      .attr("x", 340)
      .attr("y", 10)
      .attr("width", 30)
      .attr("height", 30)
      //.style('stroke', "#ffffff")
      .style("fill", "white")
      .attr("transform", "translate(" + 100 + "," + 10 + ")")
      .on("click", function(d){
        //d3.select(".d3-tip").remove()
        thirdTransition(g, sources, xAxisFocus, yAxisFocus, height, color);
      });
    
   d3.select("svg")
   .append("rect")
     .attr("x", 340)
     .attr("y", 10)
     .attr("width", 30)
     .attr("height", 30)
     //.style('stroke', "#ffffff")
     .style("fill", "#ffdcff")
     .attr("transform", "translate(" + 180 + "," + 10 + ")")
     .on("click", function(d){
       d3.select(".d3-tip").remove()
       forthTransition(g,sources,x,firstStageIndex,totalStagePortion,width);
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
function firstTransition(g, data, xAxisFocus, yAxisFocus, height, color) {
  
  //create Y axes
  g.append("g")
    .data(data)
    .transition()
    .attr("class", "y axis")
    .duration(2000)
    .call(yAxisFocus)
    .selectAll("text")//The left labels with different colors in Y axes 
      .attr("class","y-label")
      .attr("y", 40)  
      .attr("x", -10)
      .style('fill', function(d,i) { 
        return color(getStageColorIndex(i));
      })
      .style("font-size", "20px")
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
     
  //Move every sleep stage portion to the correspending stage row
  d3.selectAll(".rect-stacked")
    .data(data)
    .transition()
    .duration(2000)
      .attr("y", function(d,i){
        var yRow = getStageRow(d.stage); 
        return 80*yRow;//USE y(yRow)
      })
      .attr("height", 80)
 
  //Move all focus
  g.transition()
    .attr("y", height)
    .duration(2000);
  
  //Move X axes
  d3.select(".x.axis").transition()
    .attr("transform", "translate(0," + (height + 300) + ")")
    .duration(2000)
    .call(xAxisFocus);
    
}

//Third data vizualisation
function secondTransition(g, data, firstIndexes, totalStagePortion, width) {
  //Move all part to the left and make the first bar of each row become the cumulative portion of the stage 
  d3.selectAll(".rect-stacked")
    .data(data)
    .transition()
    .attr("x", function(d,i){ 
      return 0;
     })
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
    .attr("x", function(d, i) {
       return 50;
    })
    .attr("y", function(d,i) {
      var yRow = getStageRow(d.stage); 
      return 50 + (80*yRow);// TO DO USE FUNCTON
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "white")
    .attr("text-anchor", "middle")

   // d3.select(".x.axis").remove()
}

function thirdTransition(g, data, xAxisFocus, yAxisFocus, height, color) {

  d3.selectAll(".rect-stacked")
    .data(data)
    .transition()
    .duration(2000)
      .attr("y", function(d,i){
        var yRow = getStageRow(d.stage); 
        return 80*yRow;//USE y(yRow)
      })
      .attr("height", 10);

  //Move all focus
   g.transition()
    .attr("height", 420)
    .duration(2000);

  d3.select(".y.axis")
    .transition()
    .duration(2000)
    .attr("transform", "translate(0," + (0) + ")")
    .call(yAxisFocus)
    .selectAll("text")//The left labels with different colors in Y axes 
      .attr("class","y-label")
      .attr("y", 0)  
      .attr("x", -10)
      .style('fill', function(d,i) { 
        return color(getStageColorIndex(i));
      })
      .style("font-size", "20px")
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  
}

function forthTransition(g, data, x,firstIndexes, totalStagePortion, width) {

  d3.selectAll(".rect-stacked")
    .data(data)
    .transition()
    .duration(2000)
    .attr("x", function(d,i){
      if(i === firstIndexes[0])
        return x(d.currentStageDebut);
      if(i === firstIndexes[d.stage]){
        var cumul = totalStagePortion[0];
        if(d.stage != 4)
          cumul += totalStagePortion[4]; 
        if(d.stage === 2 || d.stage === 3 )
          cumul += totalStagePortion[1]; 
        if(d.stage === 3)
          cumul += totalStagePortion[2]; 
      return cumul*width;}
    })
    .delay(2000)
  
  d3.selectAll(".rect-stacked")
    .data(data)
    .transition()
    .duration(2000)
    .attr("x", function(d,i){
      if(i === firstIndexes[0])
        return x(d.currentStageDebut);
      if(i === firstIndexes[d.stage]){console.log(d.stage); 
        var cumul = totalStagePortion[0];
        if(d.stage != 4)
          cumul += totalStagePortion[4]; 
        if(d.stage === 2 || d.stage === 3 )
          cumul += totalStagePortion[1]; 
        if(d.stage === 3)
          cumul += totalStagePortion[2]; 
      return cumul*width;}
    })
    .transition()
    .duration(2000)
    .attr("y", function(d,i){
      if(i === firstIndexes[d.stage]) return 0;
    })
    .transition()
    .duration(1000)
    .attr("height", 80)
    
  d3.selectAll(".pourc").remove();
  d3.selectAll(".y.axis").remove();

  d3.select(".x.axis").transition()
  .attr("transform", "translate(0," + (80) + ")")
  .duration(5000)

}


/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @param currentData     Les données qui sont actuellement utilisées.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d) {
 
 var h = addZero(d.currentStageDebut.getHours());
 var m = addZero(d.currentStageDebut.getMinutes());
 var hf = addZero(d.currentStageEnd.getHours());
 var mf = addZero(d.currentStageEnd.getMinutes());

 var hourDiff = d.currentStageEnd - d.currentStageDebut; //in ms

 var hours   = Math.floor(hourDiff / 3.6e6);
 var minutes = Math.floor((hourDiff % 3.6e6) / 6e4);
 var seconds = Math.floor((hourDiff % 6e4) / 1000);

 var humanReadable = {};
 humanReadable.hours = hours;
 humanReadable.minutes = minutes ;
 humanReadable.seconds = seconds;

 return "Stage" + " " + ": <strong>" + d.stageText +  "</strong> <br>"+
        "Debut" + " : " + "<strong>" + h + ":" + m + "</strong>"+
        " - " + "Fin :" + "<strong>" + hf + ":" + mf + "</strong> <br>"+
        "Duree" + " " + ": <strong>" + addZero(hours) + ":" +  addZero(minutes) + ":" + addZero(seconds) +"</strong>" ; //TO DO ADD HOURS
}

//Will add zero to display time in this format : 00:00:00 instead of 0:0:0
function addZero(i) {
  if (i < 10) i = "0" + i;
  return i;
}

//Get the new index of the stage (with array INDEX)
function getStageColorIndex(i){
  var ci = 0;
  if(i === 1) ci = 4;
  else if(i === 2) ci = 1;
  else if(i === 3) ci = 2;
  else if(i === 4) ci = 3;
  return ci;
}

//Get row position of each stage for second viz (with STAGE)
function getStageRow(stage){
  var yRow = 0;
  if(stage === 1) yRow = 2;
  else if(stage === 2) yRow = 3;
  else if(stage === 3) yRow = 4;
  else if(stage === 4) yRow = 1;
  return yRow;
}
