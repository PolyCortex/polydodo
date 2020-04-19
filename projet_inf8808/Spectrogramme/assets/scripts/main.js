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
  var yFocus = d3.scaleBand()
  .range([0, heightFocus])

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
  d3.json("./data/spectrograms.json").then(function(data){
    console.log("SAN KALEWWA ASANY MEWAWA")
    console.log(data);
     /***** Prétraitement des données *****/
    var color = d3.scaleSequential();

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

    domainColor(color, data);

    var sources = createSources(data);
    console.log(sources)
    domainX(xFocus, data);
    domainY(yFocus, data);

    // /***** Création du graphique Stacked bar chart *****/
    createStackedBarChart(focus, sources, xFocus, yFocus, color, widthFocus, tip, xAxisFocus, yAxisFocus);
   
    // // Axes focus
    // focus.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + (heightFocus - 200) + ")")
    //   .call(xAxisFocus)
    //   .selectAll("text")
    //   .style("font-size", "18px");

    // //get tick
    // d3.selectAll(".tick")
    //   .select("text")
    //   .style("font-weight", function(d,i) {return 540})
      
    // /***** Création de l'infobulle *****/
    // tip.html(function(d) {
    //   return getToolTipText.call(this, d);
    // });
    // svg.call(tip);
   
    // tipStacked.html(function(d) {
    //   return getStackedToolTipText.call(this, d,totalStagesPortion,totalTimeStamp);
    // });
    // svg.call(tipStacked);

    // /***** Création de la légende *****/
    // legend(svg, states, color);
  });
})(d3, localization);
