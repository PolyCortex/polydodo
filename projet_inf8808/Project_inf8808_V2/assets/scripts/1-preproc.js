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
  color.domain([0, 1, 2, 3, 4])
      .range(["#E3624B", "#B0C9D9", "#4da6fe", "#48587f", "#FFD443"]);
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe X.
 *
 * @param xFocus      Échelle en X utilisée avec le graphique "focus".
 * @param xContext    Échelle en X utilisée avec le graphique "contexte".
 * @param data        Données provenant du fichier CSV.
 */
function domainX(xFocus, data) {
  xFocus.domain([data[0].timestamp, data[data.length-1].timestamp]);
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe Y.
 *
 * @param yFocus      Échelle en Y utilisée avec le graphique "focus".
 * @param yContext    Échelle en Y utilisée avec le graphique "contexte".
 * @param sources     Données triées par nom de rue et par date (voir fonction "createSources").
 */
function domainY(yFocus, states) {
  var statesYOrder = states.slice(0);

  statesYOrder[1] = states[4];
  statesYOrder[2] = states[1];
  statesYOrder[3] = states[2];
  statesYOrder[4] = states[3];

  yFocus.domain(statesYOrder);
}

/**
 * Convertit les dates se trouvant dans le fichier CSV en objet de type Date.
 *
 * @param data    Données provenant du fichier CSV.
 * @see https://www.w3schools.com/jsref/jsref_obj_date.asp
 */
function convertSource(data) {
  data.forEach(row => {
    row.timestamp = new Date(row.timestamp*1000);
    row.sleep_stage = +row.sleep_stage;
  });
}

/**
 * Trie les données par nom de rue puis par date.
 *
 * @param color     Échelle de 10 couleurs (son domaine contient les noms de rues).
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
function createSources(data, states) {
  var sources = [];
  var totalTimestamps = data.length-1;
  var currentStageDebut = data[0].timestamp;
  var currentStage = 0;
  var stagePortion = 0; //portion in the night of the current stage 

  data.forEach((row,i) => { 
      stagePortion++;
      //We sum the portions of the current stage 
      if(row.sleep_stage !== currentStage || i === data.length-1){
        sources.push({
          stage: currentStage,
          stageText: states[currentStage],
          stagePortion: (stagePortion/totalTimestamps)*100,
          currentStageDebut: currentStageDebut, 
          currentStageEnd: row.timestamp
        });
        //next sleep stage
        currentStageDebut = row.timestamp; 
        currentStage = row.sleep_stage;
        stagePortion = 0;
      }
  });

  return sources
}

//Calculate the total portion of each sleep stage (for Viz 3)
function calculateStagesPortion(data) {
  var stageProportionCounts= [0,0,0,0,0];
  var totalTimestamp = data.length;
  //lets find how much % of the night does all stages have
  data.forEach(row => { 
      ++stageProportionCounts[row.sleep_stage];
  });
  
  stageProportionCounts.forEach((stagePortion,i) => {
    stageProportionCounts[i] = (stagePortion/totalTimestamp);
  })
  
  return stageProportionCounts;
}

//Finds the index of the first element of each sleep stage (for Viz 3)
function findFirstStageIndex(data){
  var firstIndexes = [];

  for(var stage = 0; stage < 5; stage++){
    firstIndexes.push(data.findIndex(element => 
      element.stage === stage
    ));
  } 

  return firstIndexes;
}
