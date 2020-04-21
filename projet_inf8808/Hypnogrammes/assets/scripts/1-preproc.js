"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */


/**
 * Précise le domaine en associant un nom de rue à une couleur précise.
 *
 * @param color   Échelle de couleur
 * @param label_values    Données provenant du fichier CSV.
 */
const domainColor = (color, label_values) => {
  const label_colors = {
    'W': "#E3624Bs",
    'N1': "#B0C9D9",
    'N2': "#4da6fe",
    'N3': "#48587f",
    'REM': "#FFD443"
  };
  const domain = Object.values(label_values);
  const range = Object.keys(label_values).map(key => label_colors[key]);

  color.domain(domain).range(range);
}



/**
 * Convertit les dates se trouvant dans le fichier CSV en objet de type Date.
 *
 * @param data    Données provenant du fichier CSV.
 */
function parseTimestampToDate(data) {
  data.forEach(row => {
    // To convert UNIX timestamp to JS Date, we have to convert nb of seconds to milliseconds.
    const date = new Date(row.timestamp * 1000);
    row.timestamp = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDay(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds());
  });
}

function convertLabelValues(data, label_values) {
  const raw_data_labels_value = {
    'W': 0,
    'N1': 1,
    'N2': 2,
    'N3': 3,
    'REM': 4,
  }

  data.forEach(row => {
    // To convert UNIX timestamp to JS Date, we have to convert nb of seconds to milliseconds.
    const sleep_stage_label = Object
      .keys(raw_data_labels_value)
      .find(key => raw_data_labels_value[key] == row.sleep_stage);
    row.sleep_stage = label_values[sleep_stage_label];
  });
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe X.
 *
 * @param x           Échelle en X utilisée avec le graphique "focus".
 * @param data        Données provenant du fichier CSV.
 */
const domainX = (x, data) => {
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  const dates = data.map(datum => datum.timestamp);
  x.domain([d3.min(dates), d3.max(dates)]);
};

const domainY = (y, label_values) => {
  y.domain(Object.values(label_values));
}
