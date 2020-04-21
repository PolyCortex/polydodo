"use strict";

/**
 * Fichier permettant de générer la légende et de gérer les interactions de celle-ci.
 */

/**
 * Crée une légende à partir de la source.
 *
 * @param svg       L'élément SVG à utiliser pour créer la légende.
 * @param color     L'échelle de couleurs.
 */
function legend(svg, color, graphHeight, graphWidth, graphMargin) {
  
  var interpolate = d3.interpolate(color.domain()[0], color.domain()[1])

  var colors = []
  var totalPoints = 3
  for (let index = 0; index <= totalPoints; index++) {
    var interpolateIndex = index/totalPoints
    var scaleIndex = interpolate(interpolateIndex)
    colors.push(color(scaleIndex))
  }
  // Create the svg:defs element and the main gradient definition.
  var svgDefs = svg.append('defs');

  var mainGradient = svgDefs.append('linearGradient')
    .attr('id', 'mainGradient');

  // Create the stops of the main gradient. Each stop will be assigned
  // a class to style the stop using CSS.
  mainGradient.selectAll("stop")
    .data(colors)
    .enter()
    .append('stop')
    .attr('stop-color', function(d, i){return d})
    .attr('offset', function(d,i){
      return i/(colors.length-1);
    });
  

  // Use the gradient to set the shape fill, via CSS.
  svg.append('rect')
    .attr('fill', "url(#mainGradient)")
    .attr('x', graphWidth + graphMargin.left + (graphMargin.right/2))
    .attr('y', graphMargin.top)
    .attr('width', graphMargin.right/2)
    .attr('height', graphHeight)
}
