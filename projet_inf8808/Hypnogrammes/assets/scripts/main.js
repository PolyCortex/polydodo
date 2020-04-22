const initializeHypnogram = (d3, localization) => {
  /***** Configuration *****/

  // Graphique principal (focus)
  const margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 60
  };

  const width = 1200 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  /***** Échelles *****/
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleOrdinal().range([...Array(6).keys()].map(x => (x/5)*height));

  const xAxis = d3.axisBottom(x).tickFormat(localization.getFormattedDate);
  const yAxis = d3.axisLeft().scale(y);

  /***** Création des éléments *****/
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Groupe affichant le graphique principal (focus).
  const focus = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Ajout d'un plan de découpage.
  svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  return { x, y, xAxis, yAxis, focus, height };
};

(function (d3, localization) {
  "use strict";

  const label_values = {
    'W': 0,
    'REM': 1,
    'N1': 2,
    'N2': 3,
    'N3': 4,
  };

  const { x, y, xAxis, yAxis, focus, height } = initializeHypnogram(d3, localization);

  // Fonctions pour dessiner les lignes
  const line = createLine(x, y);

  /***** Chargement des données *****/
  d3.csv("./data/hypnogram.csv").then(function (data) {
    /***** Prétraitement des données *****/
    const color = d3.scaleOrdinal();
    parseTimestampToDate(data);
    convertLabelValues(data, label_values);

    // domainColor(color, label_values);
    domainX(x, data);
    domainY(y, label_values);

    // /***** Création du graphique focus *****/
    createFocusLineChart(focus, data, line, color);

    focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    yAxis.tickValues(Object.keys(label_values));
    focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    // /***** Création de la légende *****/
    // legend(svg, sources, color);
  });
})(d3, localization);
