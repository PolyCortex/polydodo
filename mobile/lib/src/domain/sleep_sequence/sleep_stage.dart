class SleepStage {
  SleepStageType stage;
  int timestamp;

  SleepStage(this.stage, this.timestamp);
}

enum SleepStageType { wake, rem, n1, n2, n3 }
