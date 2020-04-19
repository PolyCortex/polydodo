"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier JSON.
 */

/**
 * Précise le domaine en associant un stage de sommeil à une couleur précise.
 *
 * @param color   Échelle de 10 couleurs.
 * @param data    Données provenant du fichier JSON.
 */
function domainColor(color, data) {
  var maxIntensity = d3.max(data.Fpz_Cz.map(d => d3.max(d)))
  var minIntensity = d3.min(data.Fpz_Cz.map(d => d3.min(d)))
  color.domain([minIntensity, maxIntensity])
      .interpolator(d3.interpolateRainbow);
}

/**
 * Précise le domaine des échelles utilisées par le graphique pour l'axe X.
 *
 * @param x      Échelle en X utilisée avec le graphique.
 * @param data        Données provenant du fichier JSON.
 */
function domainX(x, data) {
  x.domain([0, data.Fpz_Cz.length]);
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
function createSources(data) {
  var sources = [];
  for (let index = 0; index < data.Fpz_Cz.length; index++) {
    var intensityArray = data.Fpz_Cz[index];
    var timeStamp = index
    var datumArray = intensityArray.map(function(x, i){
      return {"Frequency": data.Frequencies[i], "Intensity": x, "Timestamp":timeStamp}
    })
    sources = sources.concat(datumArray)
  }

  return sources
}