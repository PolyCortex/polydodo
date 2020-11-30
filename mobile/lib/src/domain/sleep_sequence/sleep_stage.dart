class SleepStage {
  SleepStageType stage;
  DateTime timestamp;

  SleepStage(this.stage, this.timestamp)
      : assert(stage != null, 'stage cannot be null'),
        assert(timestamp != null, 'stage cannot be null');
}

enum SleepStageType { wake, n1, n2, n3, rem }

Map sleepStageMap = {
  'W': SleepStageType.wake.index,
  'N1': SleepStageType.n1.index,
  'N2': SleepStageType.n2.index,
  'N3': SleepStageType.n3.index,
  'REM': SleepStageType.rem.index,
};
