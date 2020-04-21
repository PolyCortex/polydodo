"use strict";

/**
 * Crée une ligne SVG en utilisant les domaines X et Y spécifiés.
 * Cette fonction est utilisée par les graphiques "focus" et "contexte".
 *
 * @param x               Le domaine X.
 * @param y               Le domaine Y.
 * @return d3.svg.line    Une ligne SVG.
 *
 * @see https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89      (voir line generator)
 */
const createLine = (x, y) => {
  // TODO: Retourner une ligne SVG (voir "d3.line"). Pour l'option curve, utiliser un curveBasisOpen.
  // Vérifier si ce sont les bons champs du datum qu'on met (si ce n'est pas x et y).
  return d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.sleep_stage))
    .curve(d3.curveBasisOpen);
};

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
const createFocusLineChart = (g, data, line, color) => {
  g.append("path")
      .datum(data)
    .attr("class", "line")
    .attr("d", x => line(x))
    .attr("stroke", "black")
    .attr("clip-path", "url(#clip)");
};

