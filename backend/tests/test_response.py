class TestReportTimePassedInStage():
    """
    "wakeAfterSleepOffset": 500, // [seconds] (wakeUpTime - sleepOffset)
    "efficientSleepTime": 27113, // Total amount of seconds passed in non-wake stages
    "WASO": 3932, // Total amount of time passed in nocturnal awakenings. It is the total time passed in non-wake stage from sleep Onset to sleep offset (totalSleepTime - efficientSleepTime)
    "WTime": 3932, // [seconds] time passed in this stage between bedTime to wakeUpTime
    "SleepTime": 31045, // Total amount of time sleeping including nocturnal awakenings (sleepOffset - sleepOnset)
    "REMTime": 2370,
    "N1Time": 3402,
    "N2Time": 16032,
    "N3Time": 5309
    """

    def test_null_time_passed_in_stage(self):
        pass

    def test_complete_time_passed_in_stage(self):
        pass

    def test_partial_time_passed_in_stage(self):
        pass


class TestReportLatency():
    """
    "sleepLatency": 1000, // Time to fall asleep [seconds] (sleepOnset - bedTime)
    "remLatency": 3852, // [seconds] (remOnset- bedTime)
    """

    def test_bla(self):
        pass


class TestReportTimestamps():
    """
    "sleepOnset": 1602211380, // Time at which the subject fell asleep (time of the first non-wake epoch)
    "sleepOffset": 1602242425, // Time at which the subject woke up (time of the epoch after the last non-wake epoch)
    "remOnset": 1602214232, // First REM epoch
    """

    def test_bla(self):
        pass


class TestReportMetrics():
    """
    "sleepEfficiency": 0.8733, // Overall sense of how well the patient slept (totalSleepTime/bedTime)
    "awakenings": 7, // number of times the subject woke up between sleep onset & offset
    "stageShifts": 89, // number of times the subject transitionned from one stage to another between sleep onset & offset
    """
    pass
