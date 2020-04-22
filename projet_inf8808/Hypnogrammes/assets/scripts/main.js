const initializeHypnogram = (d3, localization, margin, width, height) => {

  const initializeScales = () => {
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleOrdinal().range([...Array(6).keys()].map(x => (x / 5) * height));

    return { x, y };
  };

  const initializeAxes = (x, y) => {
    const xAxis = d3.axisBottom(x).tickFormat(localization.getFormattedDate);
    const yAxis = d3.axisLeft().scale(y);

    return { xAxis, yAxis };
  };

  const createDrawingGroup = () => {
    const svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    return g;
  }

  const { x, y } = initializeScales();
  const { xAxis, yAxis } = initializeAxes(x, y);
  const g = createDrawingGroup();

  return { x, y, xAxis, yAxis, g };
};

(function (d3, localization) {
  "use strict";
  const sleep_labels = ['W', 'REM', 'N1', 'N2', 'N3'];

  const margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 60
  };
  const width = 1000 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const { x, y, xAxis, yAxis, g } = initializeHypnogram(d3, localization, margin, width, height);
  const line = createLine(x, y);

  /***** Chargement des données *****/
  d3.csv("./data/hypnogram.csv").then(function (data) {
    parseTimestampToDate(data);
    convertValuesToLabels(data);

    domainX(x, data);
    domainY(y, sleep_labels);

    createHypnogramChart(g, data, line, y);
    createMouseOver(g, margin, width, height);

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    g.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  });
})(d3, localization);
