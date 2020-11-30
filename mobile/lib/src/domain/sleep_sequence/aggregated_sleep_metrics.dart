import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

/*
Le temps de sommeil effectif de la dernière séquence de sommeil acquise.
- Latence du sommeil de la dernière séquence
- Efficacité de la dernière séquence de sommeil acquise.
- Le temps de sommeil effectif moyen des séquences qui composent l’historique.
- Latence du sommeil moyen des séquences qui composent l’historique
- Efficacité moyenne des séquences de sommeil qui composent l’historique.
- Graphique de l’évolution de l’efficacité dans le temps (à partir des nuits qui composent
l’historique).
*/

class AggregatedSleepMetrics {
  AggregatedSleepMetrics();

  static double getLastSequenceEfficiency(List<SleepSequence> sleepHistory) {
    return sleepHistory.last.metrics.sleepEfficiency;
  }

  static int getLastSequenceLatency(List<SleepSequence> sleepHistory) {
    return sleepHistory.last.metrics.sleepLatency;
  }

  static Duration getAverageSleepTime(List<SleepSequence> sleepHistory) {
    return sleepHistory.fold<Duration>(
          Duration(),
          (sum, element) => sum + element.metrics.effectiveSleepTime,
        ) ~/
        sleepHistory.length;
  }

  static int getAverageSleepLatency(List<SleepSequence> sleepHistory) {
    return sleepHistory.fold(
          0,
          (sum, element) => sum + element.metrics.sleepLatency,
        ) /
        sleepHistory.length;
  }

  static double getAverageSleepEffiency(List<SleepSequence> sleepHistory) {
    return sleepHistory.fold(
          0.0,
          (sum, element) => sum + element.metrics.sleepEfficiency,
        ) /
        sleepHistory.length;
  }
}
