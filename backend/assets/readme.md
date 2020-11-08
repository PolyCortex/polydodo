## Json implicit schema and field description.

```
{
  "board": "CYTON", // "CYTON" or "GANGLION"
  "subject": {
    "age": 28,
    "sex": "F" // "F" or "M"
  },
  "metadata": {
    "sessionStartTime": 1602209872, // Unix Timestamp corresponding to the beginning of the session
    "sessionEndTime": 1602243329, // Unix Timestamp corresponding to the end of the session
    "totalSessionTime": 33457, // sessionEndTime - sessionStartTime
    "bedTime": 1602210380, // Unix Timestamp corresponding to the moment where the subject went to bed
    "wakeUpTime": 1602242925, // Unix Timestamp corresponding to the moment where the subject got out of bed
    "totalBedTime": 32545 // Total amount of seconds passed in bed (wakeUpTime-bedTime)
  },
  "report": {
    "sleepOnset": 1602211380, // Time at which the subject fell asleep (time of the first non-wake epoch)
    "sleepOffset": 1602242425, // Time at which the subject woke up (time of the epoch after the last non-wake epoch)
    "remOnset": 1602214232, // First REM epoch

    "sleepLatency": 1000, // Time to fall asleep [seconds] (sleepOnset - bedTime)
    "remLatency": 3852, // [seconds] (remOnset- bedTime)

    "sleepEfficiency": 0.8733, // Overall sense of how well the patient slept (totalSleepTime/bedTime)
    "awakenings": 7, // number of times the subject woke up between sleep onset & offset
    "stageShifts": 89, // number of times the subject transitionned from one stage to another between sleep onset & offset


    "wakeAfterSleepOffset": 500, // [seconds] (wakeUpTime - sleepOffset)
    "efficientSleepTime": 27113, // Total amount of seconds passed in non-wake stages
    "WASO": 3932, // Total amount of time passed in nocturnal awakenings. It is the total time passed in non-wake stage from sleep Onset to sleep offset (totalSleepTime - efficientSleepTime)
    "WTime": 3932, // [seconds] time passed in this stage between bedTime to wakeUpTime
    "SleepTime": 31045, // Total amount of time sleeping including nocturnal awakenings (sleepOffset - sleepOnset)
    "REMTime": 2370,
    "N1Time": 3402,
    "N2Time": 16032,
    "N3Time": 5309
  },
  "epochs": {
    "timestamps": [
      ... // UNIX timestamp of each stage
    ],
    "stages": [
      ... // Stage of each timestamp. This array has the same size that timestamps. Possible values are "W", "REM", "N1", "N2", "N3"
    ]
  },
  "spectrograms": {
    "frequencies": [...],
    "fpz-cz": [ // Contains an array for each timestamps in epochs.timestamps for the fpz-cz eeg channel
      [...],  // Contains a value for each frequency
      [...],
       ...
      [...]
    ],
    "pz-oz": [  // Same as fpz-cz but for the pz-oz eeg channel
      [...],
      [...],
       ...
      [...]
    ]
  }
}
```
