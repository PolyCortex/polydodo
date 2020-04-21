"use strict";

function createSpectrogram(g, node, width, height, margin){
  
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

  /****** Axes *******/
  var xAxis = d3.axisBottom(x).tickFormat(d => `${d}h`);
  var yAxis= d3.axisLeft(yAxisScale).ticks(5, "s")


  // Groupe affichant le graphique principal ().
  var spectrogram = g.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var gLegend = g.append("g")
    .attr("transform", "translate(" + (margin.left + width) + "," + margin.top + ")");

  /***** Chargement des données *****/
  d3.json("./data/spectrograms.json").then(function(data){

     /***** Prétraitement des données *****/
    var color = d3.scaleSequential()
                  .interpolator(colorInterpolator)

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

    var sources = createSources(data, node);
    domainColor(color, sources);
    domainColor(yColor, sources);


    domainX(x, data, node);
    domainY(y, yAxisScale, data);

    // /***** Création du graphique Stacked bar chart *****/
    createSpectrgrammeBarChart(spectrogram, sources, x, y, color, tip, height, width, margin, xAxis, yAxis);

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
      
    // /***** Création de l'infobulle *****/
    tip.html(function(d) {
      return getToolTipText.call(this, d);
    });
    g.call(tip);

    // /***** Création de la légende *****/
    legend(gLegend, color, yColor, height, margin.right);
  });
}