from tests.setup import pytest_generate_tests  # noqa: F401

from classification.config.constants import EPOCH_DURATION
from classification.response import ClassificationResponse
from classification.request import ClassificationRequest

MOCK_REQUEST = ClassificationRequest


class TestReportTimePassedInStage():
    """
    "wakeAfterSleepOffset": 500, // [seconds] (wakeUpTime - sleepOffset)
    "efficientSleepTime": 27113, // Total amount of seconds passed in non-wake stages
    "WASO": 3932, // Total amount of time passed in nocturnal awakenings. It is the total time passed in non-wake stage from sleep Onset to sleep offset (totalSleepTime - efficientSleepTime)
    "SleepTime": 31045, // Total amount of time sleeping including nocturnal awakenings (sleepOffset - sleepOnset)

    "WTime": 3932, // [seconds] time passed in this stage between bedTime to wakeUpTime
    "REMTime": 2370,
    "N1Time": 3402,
    "N2Time": 16032,
    "N3Time": 5309
    """
    params = {
        "test_null_time_passed_in_stage": [dict(
            sequence=['W', 'W', 'W'], w_time=3 * EPOCH_DURATION, rem_time=0, n1_time=0, n2_time=0, n3_time=0,
        ), dict(
            sequence=['REM', 'REM', 'REM'], rem_time=3 * EPOCH_DURATION, w_time=0, n1_time=0, n2_time=0, n3_time=0,
        ), dict(
            sequence=['N1', 'N1', 'N1'], n1_time=3 * EPOCH_DURATION, w_time=0, rem_time=0, n2_time=0, n3_time=0,
        ), dict(
            sequence=['N2', 'N2', 'N2'], n2_time=3 * EPOCH_DURATION, w_time=0, rem_time=0, n1_time=0, n3_time=0,
        ), dict(
            sequence=['N3', 'N3', 'N3'], n3_time=3 * EPOCH_DURATION, w_time=0, rem_time=0, n1_time=0, n2_time=0,
        )],
        "test_complete_time_passed_in_stage": [dict()],
        "test_partial_time_passed_in_stage": [dict()],
    }

    def test_null_time_passed_in_stage(self, sequence, w_time, rem_time, n1_time, n2_time, n3_time):
        # ClassificationResponse(sequence, )
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
    params = {
        "test_bla": [dict()]
    }

    def test_bla(self):
        pass


class TestReportTimestamps():
    """
    "sleepOnset": 1602211380, // Time at which the subject fell asleep (time of the first non-wake epoch)
    "sleepOffset": 1602242425, // Time at which the subject woke up (time of the epoch after the last non-wake epoch)
    "remOnset": 1602214232, // First REM epoch
    """
    params = {
        "test_bla": [dict()]
    }

    def test_bla(self):
        pass


class TestReportMetrics():
    """
    "sleepEfficiency": 0.8733, // Overall sense of how well the patient slept (totalSleepTime/bedTime)
    "awakenings": 7, // number of times the subject woke up between sleep onset & offset
    "stageShifts": 89, // number of times the subject transitionned from one stage to another between sleep onset & offset
    """
    params = {
    }
