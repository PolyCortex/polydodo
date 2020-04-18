/**
 * Fichier principal permettant de dessiner les deux graphiques demandés. Ce fichier utilise les autres fichiers
 * que vous devez compléter.
 *
 * 
 */
(function(d3, localization) {
  "use strict";

  /***** Configuration *****/

  // Graphique principal (focus)
  var marginFocus = {
    top: 100,
    right: 10,
    bottom: 100,
    left: 100
  };
  var widthFocus = 1200 /*- marginFocus.left - marginFocus.right*/;
  var heightFocus = 600 - marginFocus.top - marginFocus.bottom;
   
  /***** Échelles *****/
  var xFocus = d3.scaleTime().range([0, widthFocus]);
  var yFocus = d3.scaleOrdinal()
  .range([0, heightFocus*0.2 , heightFocus*0.4, heightFocus*0.6, heightFocus*0.8, heightFocus])

  /****** Axes *******/
  var xAxisFocus = d3.axisBottom(xFocus).tickFormat(localization.getFormattedDate);
  var yAxisFocus= d3.axisLeft().scale(yFocus).ticks(5, "s")
  .tickSize(-widthFocus);//will create the lines in second visualisation

  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", widthFocus + marginFocus.left + marginFocus.right)
    .attr("height", heightFocus + marginFocus.top + marginFocus.bottom);

  // Groupe affichant le graphique principal (focus).
  var focus = svg.append("g")
    .attr("transform", "translate(" + marginFocus.left + "," + marginFocus.top + ")");

  /***** Chargement des données *****/
  d3.csv("./data/time2.csv").then(function(data) {
    /***** Prétraitement des données *****/
    var states = ["W","N1","N2","N3","REM"];
    var color = d3.scaleOrdinal();
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
    
    var tipStacked = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

    domainColor(color, data);
    convertSource(data);

    var sources = createSources(data, states);
  
    //For visualisation 3
    var totalStagePortion = calculateStagesPortion(data);
    var firstStageIndex = findFirstStageIndex(sources); 
    
    domainX(xFocus, data);
    domainY(yFocus, states);
    var translationHeight = 100;

    /***** Création du graphique Stacked bar chart *****/
    createStackedBarChart(focus, sources, xFocus, yFocus, color, translationHeight,widthFocus, tip,tipStacked, xAxisFocus, yAxisFocus, firstStageIndex, totalStagePortion);
   
    // Axes focus
    focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (heightFocus - 200) + ")")
      .call(xAxisFocus)
      .selectAll("text")
      .style("font-size", "18px");

    //get tick
    d3.selectAll(".tick")
      .select("text")
      .style("font-weight", function(d,i) {return 540})
      
    /***** Création de l'infobulle *****/
    tip.html(function(d) {
      return getToolTipText.call(this, d);
    });
    svg.call(tip);

    tipStacked.html(function(d) {
      return getStackedToolTipText.call(this, d);
    });
    svg.call(tipStacked);

    /***** Création de la légende *****/
    legend(svg, states, color);
  });
})(d3, localization);
