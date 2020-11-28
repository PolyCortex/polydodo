class SleepSequenceMetrics {
  Duration effectiveSleepTime;
  double sleepEfficiency;
  int sleepLatency;
  Duration waso;
  int awakenings;
  int remLatency;
  int shifts;

  SleepSequenceMetrics({
    this.effectiveSleepTime,
    this.sleepEfficiency,
    this.sleepLatency,
    this.waso,
    this.awakenings,
    this.remLatency,
    this.shifts,
  });
}
