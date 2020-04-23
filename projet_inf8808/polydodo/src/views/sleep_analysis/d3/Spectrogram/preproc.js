"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier JSON.
 */

/**
 * Précise le domaine en associant un stage de sommeil à une couleur précise.
 *
 * @param color   Échelle de 10 couleurs.
 * @param sources Données formaté
 * 
 */
function spectroDomainColor(color, sources) {
  var extent = d3.extent(sources, d=> d.Intensity)
  color.domain(extent)
}

/**
 * Précise le domaine des échelles utilisées par le graphique pour l'axe X.
 *
 * @param x      Échelle en X utilisée avec le graphique.
 * @param node      The name of the node to get the data from 
 * @param data        Données provenant du fichier JSON.
 */
function spectroDomainX(x, data, node) {
  x.domain([0, getHoursFromIndex(data[node].length/DATUM_PER_TIMESTAMP)]);
}

/**
 * Précise le domaine des échelles utilisées par le graphique pour l'axe Y.
 *
 * @param y           Échelle en Y utilisée avec le graphique.
 * @param yAxisScale           Échelle en Y utilisée pour l'axe.
 * @param data        Données provenant du fichier JSON.
 */
function spectroDomainY(y, yAxisScale, frequencies) {
  y.domain(frequencies);
  yAxisScale.domain([frequencies[0], frequencies[frequencies.length-1]])
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
function createSpectroSources(data, node, frequencies) {
  var sources = [];
  var nodeData = data[node]
  for (let idx = 0; idx < nodeData.length; idx+=DATUM_PER_TIMESTAMP) {
    for (let jdx = 0; jdx < data.Frequencies.length; jdx+=FREQUENCY_BINS){
      var frequency = data.Frequencies[jdx]
      var intensity = 0;
      var currFrequencyBin = 0
      var currTimestampBin = 0
      for (let kdx = idx; kdx < idx+ DATUM_PER_TIMESTAMP && kdx <nodeData.length; kdx++) {
        currTimestampBin++;
        var currFrequencyBin = 0
        for (let ldx = jdx; ldx < jdx+FREQUENCY_BINS && ldx < data.Frequencies.length; ldx++) {
          currFrequencyBin++;
          intensity += nodeData[kdx][ldx];
        }
      }
      var timeStamp = getHoursFromIndex(Math.ceil(idx/DATUM_PER_TIMESTAMP))
      
      sources.push({"Frequency": frequencies[Math.ceil(jdx/FREQUENCY_BINS)], "Intensity": intensity/currTimestampBin/currTimestampBin, "Timestamp":timeStamp})

    }
  }

  return sources
}

function getHoursFromIndex(idx){
  return idx * TIMESTAMP_DURATION /60.0 /60
}