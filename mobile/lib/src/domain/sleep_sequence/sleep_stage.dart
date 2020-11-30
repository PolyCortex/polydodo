class SleepStage {
  SleepStageType stage;
  DateTime timestamp;

  SleepStage(this.stage, this.timestamp)
      : assert(stage != null, 'stage cannot be null'),
        assert(timestamp != null, 'stage cannot be null');
}

enum SleepStageType { wake, rem, n1, n2, n3 }
