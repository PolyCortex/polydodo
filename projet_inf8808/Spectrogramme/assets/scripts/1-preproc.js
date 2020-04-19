"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */

/**
 * Précise le domaine en associant un stage de sommeil à une couleur précise.
 *
 * @param color   Échelle de 10 couleurs.
 * @param data    Données provenant du fichier CSV.
 */
function domainColor(color, data) {
  var maxIntensity = d3.max(data.Fpz_Cz.map(d => d3.max(d)))
  var minIntensity = d3.min(data.Fpz_Cz.map(d => d3.min(d)))
  console.log(`min:${minIntensity}, max: ${maxIntensity}`)
  color.domain([minIntensity, maxIntensity])
      .interpolator(d3.interpolateRainbow);
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe X.
 *
 * @param xFocus      Échelle en X utilisée avec le graphique "focus".
 * @param data        Données provenant du fichier JSON.
 */
function domainX(xFocus, data) {
  xFocus.domain([0, data.Fpz_Cz.length]);
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe Y.
 *
 * @param yFocus      Échelle en Y utilisée avec le graphique "focus".
 * @param data        Données provenant du fichier JSON.
 */
function domainY(yFocus, data) {
  yFocus.domain(data.Frequencies);
}

/**
 * Trie les données par nom de rue puis par date.
 *
 * @param data      Données provenant du fichier CSV.
 *
 * @return Array    Les données triées qui seront utilisées pour générer les graphiques.
 *                  L'élément retourné doit être un tableau d'objets comptant 10 entrées, une pour chaque rue
 *                  et une pour la moyenne. L'objet retourné doit être de la forme suivante:
 *
 *                  [
 *                    {
 *                      name: string      // Le nom de la rue,
 *                      values: [         // Le tableau compte 365 entrées, pour les 365 jours de l'année.
 *                        date: Date,     // La date du jour.
 *                        count: number   // Le nombre de vélos compté ce jour là (effectuer une conversion avec parseInt)
 *                      ]
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