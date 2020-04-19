/**
 * Fichier principal permettant de dessiner les deux graphiques demandés. Ce fichier utilise les autres fichiers
 * que vous devez compléter.
 *
 * 
 */
(function(d3, localization) {
  "use strict";

  /***** Configuration *****/
  // Graphique principal ()
  var margin = {
    top: 100,
    right: 10,
    bottom: 100,
    left: 100
  };
  var width = 2000 /*- margin.left - margin.right*/;
  var height = 1200 - margin.top - margin.bottom;
   
  /***** Échelles *****/
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleBand()
  .range([0, height])
  var yAxisScale = d3.scaleLinear()
  .range([0, height])

  /****** Axes *******/
  var xAxis = d3.axisBottom(x).tickFormat(getLabelFromIndex);
  var yAxis= d3.axisLeft(yAxisScale).ticks(5, "s")

  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Groupe affichant le graphique principal ().
  var spectrogram = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  /***** Chargement des données *****/
  d3.json("./data/spectrograms.json").then(function(data){

     /***** Prétraitement des données *****/
    var color = d3.scaleSequential();

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

    domainColor(color, data);

    var sources = createSources(data);
    domainX(x, data);
    domainY(y, yAxisScale, data);

    // /***** Création du graphique Stacked bar chart *****/
    createSpectrgrammeBarChart(spectrogram, sources, x, y, color, tip, xAxis, yAxis);
   
    // Axes 
    spectrogram.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "18px");

    spectrogram.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0" + ",0)")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "18px");


    // //get tick
    // d3.selectAll(".tick")
    //   .select("text")
    //   .style("font-weight", function(d,i) {return 540})
      
    // /***** Création de l'infobulle *****/
    tip.html(function(d) {
      return getToolTipText.call(this, d);
    });
    svg.call(tip);

    // /***** Création de la légende *****/
    // legend(svg, states, color);
  });
})(d3, localization);
