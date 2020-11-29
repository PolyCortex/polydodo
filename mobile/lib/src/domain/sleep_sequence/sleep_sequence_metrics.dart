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
  })  : assert(!effectiveSleepTime.isNegative),
        assert(!sleepEfficiency.isNegative),
        assert(sleepEfficiency <= 1.0),
        assert(!waso.isNegative),
        assert(!awakenings.isNegative),
        assert(!remLatency.isNegative),
        assert(!shifts.isNegative);
}
