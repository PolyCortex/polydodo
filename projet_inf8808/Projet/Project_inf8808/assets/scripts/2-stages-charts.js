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
function createStackedBarChart(g,sources, x, y, color, height, width, tip, tipStacked, xAxisFocus, yAxisFocus, firstStageIndex, totalStagePortion) {
  //Creating all the parts of the stacked bar chart
  var state = 0
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
        if(state == 0){
          firstTransition(g,sources,xAxisFocus,yAxisFocus,height,color);
        }
        else if(state == 1){
          d3.select(".d3-tip").remove()
          secondTransition(g,sources,firstStageIndex,totalStagePortion,width,xAxisFocus, x, tipStacked);
        }
        state = (state + 1) % 2
      })
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
      .attr("y", 40)  
      .attr("x", -10)
      .style('stroke', function(d,i) { 
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
function secondTransition(g, data, firstIndexes, totalStagePortion, width, xAxis,x, tip) {  
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

  d3.select(".x.axis").transition()
    .call(xAxis)
    .call(x)


  //Move all part to the left and make the first bar of each row become the cumulative portion of the stage 
  d3.selectAll(".rect-stacked")
    .data(data)
    .on("mouseover", function(d, i) {
      tip.show(d);
      d3.select(this).style("opacity", 0.8);
    })
    .on("mouseout",function(d){
      tip.hide();
      d3.select(this).style("opacity", 1);
    }) 
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
}

/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d) {
 
  var h = addZero(d.currentStageDebut.getHours());
  var m = addZero(d.currentStageDebut.getMinutes());
  var hf = addZero(d.currentStageEnd.getHours());
  var mf = addZero(d.currentStageEnd.getMinutes());

  var hourDiff = d.currentStageEnd - d.currentStageDebut; //in ms
  hourDiff/= 3.6e6; //in h

  return `Stage : <strong> ${d.stageText} </strong> <br>
          Debut  :  <strong> ${h} h ${m}  </strong>
            -  Fin : <strong> ${hf} h ${mf} </strong> <br>
          Duree: <strong> ${getDurationString(hourDiff)} </strong>`; //TO DO ADD HOURS
}

/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getStackedToolTipText(d) {
 

  return `Stage : <strong> ${d.stageText} </strong><br> 
          Duree : <strong> ${getDurationString(d.stagePortion)} </strong><br>`;
}

function getDurationString(duration){
  var hours = Math.floor(duration)
  var minutes = (duration % 1.0) * 60.0
  var seconds = (minutes % 1.0) * 60.0
  minutes = Math.floor(minutes)
  seconds = Math.floor(seconds)
  
  return `${addZero(hours)}h ${addZero(minutes)}min ${addZero(seconds)}secs`
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
