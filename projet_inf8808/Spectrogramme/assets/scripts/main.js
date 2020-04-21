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
    right: 150,
    bottom: 100,
    left: 100
  };
  var width = 2000 /*- margin.left - margin.right*/;
  var height = 1200 - margin.top - margin.bottom;

  /**** Interpolateur de couleurs ****/
  var colorInterpolator = d3.interpolatePlasma


  /***** Échelles *****/
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleBand()
  .range([height, 0])
  var yColor = d3.scaleLinear()
  .range(y.range())
  var yAxisScale = d3.scaleLinear()
  .range(y.range())
  var yColor2 = d3.scaleLinear()
  .range(y.range())

  /****** Axes *******/
  var xAxis = d3.axisBottom(x).tickFormat(d => `${d}h`);
  var yAxis= d3.axisLeft(yAxisScale).ticks(5, "s")

  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 2*(height + margin.top + margin.bottom));

  // Groupe affichant le graphique principal ().
  var spectrogram = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var spectrogram2 = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + (height + (2*margin.top) + margin.bottom) + ")");
  var gLegend = svg.append("g")
    .attr("transform", "translate(" + (margin.left + width) + "," + margin.top + ")");
  var gLegend2 = svg.append("g")
  .attr("transform", "translate(" + (margin.left + width) + "," + (height + (2*margin.top) + margin.bottom) + ")");

  /***** Chargement des données *****/
  d3.json("./data/spectrograms.json").then(function(data){

     /***** Prétraitement des données *****/
    var color = d3.scaleSequential()
                  .interpolator(colorInterpolator)

    var color2 = d3.scaleSequential()
                  .interpolator(colorInterpolator)
    var node = "Fpz_Cz"
    var node2 = "Pz_Oz"

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);


    console.log("About to load sources 1")
    var sources = createSources(data, node);
    domainColor(color, sources);
    domainColor(yColor, sources);
    console.log("Loaded sources 1")
    console.log("About to load sources 12")
    var sources2 = createSources(data, node2);
    domainColor(color2, sources);
    domainColor(yColor2, sources);
    console.log("Loaded sources 2")


    domainX(x, data, node);
    domainY(y, yAxisScale, data);

    // /***** Création du graphique Stacked bar chart *****/
    console.log("Create spectrogram 1")
    createSpectrgrammeBarChart(spectrogram, sources, x, y, color, tip, height, width, margin, xAxis, yAxis);
    console.log("Done spectrogram 1")
    console.log("Create spectrogram 2")
    createSpectrgrammeBarChart(spectrogram2, sources2, x, y, color2, tip, height, width, margin, xAxis, yAxis);
    console.log("Done spectrogram 2")

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

    spectrogram2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "18px");

    spectrogram2.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0" + ",0)")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "18px");

      
    // /***** Création de l'infobulle *****/
    tip.html(function(d) {
      return getToolTipText.call(this, d);
    });
    svg.call(tip);

    // /***** Création de la légende *****/
    legend(gLegend, color, yColor, height, margin.right);
    legend(gLegend2, color, yColor, height, margin.right);
  });
})(d3, localization);