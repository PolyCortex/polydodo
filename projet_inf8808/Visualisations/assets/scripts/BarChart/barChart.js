"use strict";

function createBarChart(g, width, height, margin, useTransitions = true) {

  /**** Prétraitement de donnée ****/
  var states = ["W","N1","N2","N3","REM"];
  var statesOrder = ["W","REM", "N1","N2","N3"];

  /**** Dimensions ****/
  height = Math.round(height)
  var translationHeight = Math.round(useTransitions? height / states.length: height/2);
  var barHeight = translationHeight * 2

  /***** Échelles *****/
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleOrdinal()
  .range([0, Math.round(height*0.2) ,Math.round(height*0.4) , Math.round(height*0.6) ,Math.round(height*0.8) , height])

  /****** Axes *******/
  var xAxis = d3.axisBottom(x).tickFormat(localization.getFormattedDate);
  var yAxis= d3.axisLeft().scale(y).ticks(5, "s")
  .tickSize(-width);//will create the lines in second visualisation

  // Groupe affichant le graphique principal ().
  var gBarChart = g.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /***** Chargement des données *****/
  d3.csv("./data/time2.csv").then(function(data) {
    /***** Prétraitement des données *****/
    var totalTimeStamp = data.length;
    var color = d3.scaleOrdinal();
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);


    var tipStacked = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);


    barDomainColor(color, states);
    convertSource(data);

    var sources = createBarSources(data, states, statesOrder);
  
    //For visualisation 3
    var totalStagesPortion = calculateStagesPortion(data, states, statesOrder);
    var firstStagesIndex = findFirstStageIndex(sources); 
    
    barDomainX(x, data);
    barDomainY(y, statesOrder);

    /***** Création du graphique Stacked bar chart *****/
    createStackedBarChart(gBarChart,sources, x, y, color, tip, barHeight);
    if(useTransitions){
      addTransitions(gBarChart, g,sources, x, y, color, translationHeight,barHeight, width, tipStacked, xAxis, yAxis, firstStagesIndex, totalStagesPortion);
    }
      // Axes 
    gBarChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + barHeight + ")")
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "18px");

    //get tick
    d3.selectAll(".tick")
      .select("text")
      .style("font-weight", 540)
      
    /***** Création de l'infobulle *****/
    tip.html(function(d) {
      return getBarToolTipText.call(this, d);
    });
    g.call(tip);
   
    tipStacked.html(function(d) {
      return getStackedToolTipText.call(this, d,totalStagesPortion,totalTimeStamp);
    });
    g.call(tipStacked);

    /***** Création de la légende *****/
    barLegend(g, states, color);
  });
}
