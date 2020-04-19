"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier JSON.
 */

/**
 * Précise le domaine en associant un stage de sommeil à une couleur précise.
 *
 * @param color   Échelle de 10 couleurs.
 * @param sources Données formaté
 */
function domainColor(color, sources) {
  var extent = d3.extent(sources, d=> d.Intensity)
  color.domain(extent)
      .interpolator(d3.interpolateRainbow);
}

/**
 * Précise le domaine des échelles utilisées par le graphique pour l'axe X.
 *
 * @param x      Échelle en X utilisée avec le graphique.
 * @param node      The name of the node to get the data from 
 * @param data        Données provenant du fichier JSON.
 */
function domainX(x, data, node) {
  x.domain([0, data[node].length]);
}

/**
 * Précise le domaine des échelles utilisées par le graphique pour l'axe Y.
 *
 * @param y           Échelle en Y utilisée avec le graphique.
 * @param yAxisScale           Échelle en Y utilisée pour l'axe.
 * @param data        Données provenant du fichier JSON.
 */
function domainY(y, yAxisScale,  data) {
  var sortedFrequencies = data.Frequencies
  sortedFrequencies.sort((a,b) => b - a)
  y.domain(sortedFrequencies);
  yAxisScale.domain([sortedFrequencies[0], sortedFrequencies[sortedFrequencies.length -1]])
}

/**
 * Trie les données par nom de rue puis par date.
 *
 * @param data      Données provenant du fichier JSON.
 * @param node      The name of the node to get the data from 
 * 
 * @return Array    Les données triées qui seront utilisées pour générer les graphiques.
 *                  L'élément retourné doit être un tableau d'objets comptant 10 entrées, une pour chaque rue
 *                  et une pour la moyenne. L'objet retourné doit être de la forme suivante:
 *
 *                  [
 *                    {
 *                      Frequency: float      // La fréquence du datum
 *                      Intensity: int        // L'intensity de cette fréquence
 *                      Timestamp: int        // Le temps du datum (sec)
 *                    },
 *                     ...
 *                  ]
 */
function createSources(data, node) {
  var sources = [];
  for (let index = 0; index < data[node].length; index++) {
    var intensityArray = data[node][index];
    var timeStamp = index
    var datumArray = intensityArray.map(function(x, i){
      return {"Frequency": data.Frequencies[i], "Intensity": x, "Timestamp":timeStamp}
    })
    sources = sources.concat(datumArray)
  }

  return sources
}