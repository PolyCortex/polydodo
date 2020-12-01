import 'package:meta/meta.dart';

class SleepSequenceMetrics {
  Duration effectiveSleepTime;
  double sleepEfficiency;
  int sleepLatency;
  Duration waso;
  int awakenings;
  int remLatency;
  int shifts;

  SleepSequenceMetrics({
    @required this.effectiveSleepTime,
    @required this.sleepEfficiency,
    @required this.sleepLatency,
    @required this.waso,
    @required this.awakenings,
    @required this.remLatency,
    @required this.shifts,
  })  : assert(effectiveSleepTime != null, 'effectiveSleepTime cannot be null'),
        assert(!effectiveSleepTime.isNegative,
            'effectiveSleepTime cannot be negative'),
        assert(sleepEfficiency != null, 'sleepEfficiency cannot be null'),
        assert(
            !sleepEfficiency.isNegative, 'sleepEfficiency cannot be negative'),
        assert(sleepEfficiency <= 1.0,
            'sleepEfficiency must be under 1.0 inclusively'),
        assert(waso != null, 'waso cannot be null'),
        assert(!waso.isNegative, 'waso cannot be negative'),
        assert(awakenings != null, 'awakenings cannot be null'),
        assert(!awakenings.isNegative, 'awakenings cannot be negative'),
        assert(remLatency != null, 'remLatency cannot be null'),
        assert(!remLatency.isNegative, 'remLatency cannot be negative'),
        assert(shifts != null, 'shifts cannot be null'),
        assert(!shifts.isNegative, 'shifts cannot be negative');
}
