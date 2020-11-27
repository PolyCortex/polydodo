class SleepSequenceStats {
  Duration effectiveSleepTime;
  double sleepEfficiency;
  int sleepLatency;
  Duration waso;
  int awakenings;
  int remLatency;
  int numberTransitions;

  SleepSequenceStats({
    this.effectiveSleepTime,
    this.sleepEfficiency,
    this.sleepLatency,
    this.waso,
    this.awakenings,
    this.remLatency,
    this.numberTransitions,
  });
}
