import numpy as np

from tests.setup import pytest_generate_tests  # noqa: F401
from tests.setup import get_mock_request
from backend.response import ClassificationResponse
from classification.config.constants import EPOCH_DURATION, SleepStage


def convert_sleep_stage_name_to_values(sequence):
    return np.array([SleepStage[stage].value for stage in sequence])


class TestReportTimePassedInStage():
    """Tests the time passed in each stage metrics in the response metrics
    The evaluated metrics are:
    "WTime": 3932, // [seconds] time passed in this stage between bedTime to wakeUpTime
    "REMTime": 2370,
    "N1Time": 3402,
    "N2Time": 16032,
    "N3Time": 5309
    """
    params = {
        "test_null_time_passed_in_stage": [
            dict(
                sequence=['W', 'W', 'W'],
                WTime=3 * EPOCH_DURATION,
                REMTime=0,
                N1Time=0,
                N2Time=0,
                N3Time=0),
            dict(
                sequence=['REM', 'REM', 'REM'],
                WTime=0,
                REMTime=3 * EPOCH_DURATION,
                N1Time=0,
                N2Time=0,
                N3Time=0),
            dict(
                sequence=['N1', 'N1', 'N1'],
                WTime=0,
                REMTime=0,
                N1Time=3 * EPOCH_DURATION,
                N2Time=0,
                N3Time=0),
            dict(
                sequence=['N2', 'N2', 'N2'],
                WTime=0,
                REMTime=0,
                N1Time=0,
                N2Time=3 * EPOCH_DURATION,
                N3Time=0),
            dict(
                sequence=['N3', 'N3', 'N3'],
                WTime=0,
                REMTime=0,
                N1Time=0,
                N2Time=0,
                N3Time=3 * EPOCH_DURATION),
        ], "test_partial_time_passed_in_stage": [
            dict(
                sequence=['W', 'N1', 'N2', 'W'],
                WTime=2 * EPOCH_DURATION,
                REMTime=0,
                N1Time=EPOCH_DURATION,
                N2Time=EPOCH_DURATION,
                N3Time=0),
            dict(
                sequence=['N1', 'W', 'W'],
                WTime=2 * EPOCH_DURATION,
                REMTime=0,
                N1Time=EPOCH_DURATION,
                N2Time=0,
                N3Time=0),
            dict(
                sequence=['W', 'N1', 'N2', 'N3', 'REM', 'W'],
                WTime=2 * EPOCH_DURATION,
                REMTime=EPOCH_DURATION,
                N1Time=EPOCH_DURATION,
                N2Time=EPOCH_DURATION,
                N3Time=EPOCH_DURATION),
            dict(
                sequence=['N1', 'N2', 'N2', 'REM'],
                WTime=0,
                REMTime=EPOCH_DURATION,
                N1Time=EPOCH_DURATION,
                N2Time=2 * EPOCH_DURATION,
                N3Time=0),
        ]
    }

    @classmethod
    def setup_class(cls):
        cls.MOCK_REQUEST = get_mock_request()

    def test_null_time_passed_in_stage(self, sequence, WTime, REMTime, N1Time, N2Time, N3Time):
        value_sequence = convert_sleep_stage_name_to_values(sequence)
        response = ClassificationResponse(self.MOCK_REQUEST, value_sequence, None)
        report = response.report

        assert report[sequence[0].upper() + 'Time'] == len(sequence) * EPOCH_DURATION
        self.assert_times(sequence, report, WTime, REMTime, N1Time, N2Time, N3Time)

    def test_partial_time_passed_in_stage(self, sequence, WTime, REMTime, N1Time, N2Time, N3Time):
        sequence = convert_sleep_stage_name_to_values(sequence)
        response = ClassificationResponse(self.MOCK_REQUEST, sequence, None)
        report = response.report
        self.assert_times(sequence, report, WTime, REMTime, N1Time, N2Time, N3Time)

    def assert_times(self, sequence, report, WTime, REMTime, N1Time, N2Time, N3Time):
        assert (
            report['WTime']
            + report['REMTime']
            + report['N1Time']
            + report['N2Time']
            + report['N3Time']
        ) == len(sequence) * EPOCH_DURATION

        assert report['WTime'] == WTime
        assert report['REMTime'] == REMTime
        assert report['N1Time'] == N1Time
        assert report['N2Time'] == N2Time
        assert report['N3Time'] == N3Time


class TestReportDurations():
    """
    "wakeAfterSleepOffset": 500, // [seconds] (wakeUpTime - sleepOffset)
    "efficientSleepTime": 27113, // Total amount of seconds passed in non-wake stages
    "WASO": 3932, // Total amount of time passed in nocturnal awakenings. It is the total time passed in non-wake stage
                  // from sleep Onset to sleep offset (totalSleepTime - efficientSleepTime)
    "SleepTime": 31045, // Total amount of time sleeping including nocturnal awakenings (sleepOffset - sleepOnset)
    """
    params = {
        "test_wake_": [
            dict(
                sequence=['W', 'W', 'W'],
                wakeAfterSleepOffset=0,
                efficientSleepTime=0,
                WASO=0,
                SleepTime=0,
            ), dict(
                sequence=['REM', 'REM', 'REM'],
                wakeAfterSleepOffset=0,
                efficientSleepTime=0,
                WASO=0,
                SleepTime=0,
            ), dict(
                sequence=['REM', 'REM', 'REM'],
                wakeAfterSleepOffset=0,
                efficientSleepTime=0,
                WASO=0,
                SleepTime=0,
            ), dict(
                sequence=['REM', 'REM', 'REM'],
                wakeAfterSleepOffset=0,
                efficientSleepTime=0,
                WASO=0,
                SleepTime=0,
            ),
        ],
    }

    @ classmethod
    def setup_class(cls):
        cls.MOCK_REQUEST = get_mock_request()


class TestReportLatency():
    """Tests the time it took to enter a specific stage
    The evaluated metrics are:
    "sleepLatency": 1000, // Time to fall asleep [seconds] (sleepOnset - bedTime)
    "remLatency": 3852, // [seconds] (remOnset- bedTime)
    """
    params = {
        "test_sequence_starts_with_stage": [
            dict(
                sequence=['REM', 'REM', 'W', 'W'],
                test_rem=True,
            ), dict(
                sequence=['REM', 'W', 'N1', 'W'],
                test_rem=True,
            ), dict(
                sequence=['REM', 'W', 'N1', 'N2', 'N3', 'REM', 'W'],
                test_rem=False,
            ), dict(
                sequence=['N1', 'W', 'N1', 'N2', 'N3', 'REM', 'W'],
                test_rem=False,
            ), dict(
                sequence=['N2', 'W', 'N1', 'N2', 'N3', 'REM', 'W'],
                test_rem=False,
            ), dict(
                sequence=['N3', 'W', 'N1', 'N2', 'N3', 'REM', 'W'],
                test_rem=False,
            ),
        ], "test_sequence_has_no_stage": [
            dict(
                sequence=['W', 'N1', 'N2', 'N3', 'W'],
                test_rem=True,
            ), dict(
                sequence=['W', 'W', 'W', 'W', 'W'],
                test_rem=False,
            ), dict(
                sequence=['W', ],
                test_rem=False,
            ),
        ], "test_sequence_ends_with_stage": [
            dict(
                sequence=['W', 'W', 'REM'],
                test_rem=True,
            ), dict(
                sequence=['W', 'W', 'N1'],
                test_rem=False,
            ), dict(
                sequence=['W', 'W', 'N2'],
                test_rem=False,
            ), dict(
                sequence=['W', 'W', 'N3'],
                test_rem=False,
            ),
        ], "test_sequence_with_stage_at_middle": [
            dict(
                sequence=['W', 'N1', 'N2', 'N1', 'REM', 'W'],
                test_rem=True,
                latency=4 * EPOCH_DURATION,
            ), dict(
                sequence=['W', 'W', 'N1', 'W', 'N1', 'W'],
                test_rem=False,
                latency=2 * EPOCH_DURATION,
            ), dict(
                sequence=['W', 'W', 'N2', 'W', 'N2', 'W'],
                test_rem=False,
                latency=2 * EPOCH_DURATION,
            ), dict(
                sequence=['W', 'W', 'N3', 'W', 'N3', 'W'],
                test_rem=False,
                latency=2 * EPOCH_DURATION,
            ),
        ],
    }

    @classmethod
    def setup_class(cls):
        cls.MOCK_REQUEST = get_mock_request()

    def get_report_key(self, test_rem):
        return 'remLatency' if test_rem else 'sleepLatency'

    def test_sequence_starts_with_stage(self, sequence, test_rem):
        expected_latency = 0
        self.assert_latency_equals_expected(expected_latency, sequence, test_rem)

    def test_sequence_has_no_stage(self, sequence, test_rem):
        expected_latency = -1
        self.assert_latency_equals_expected(expected_latency, sequence, test_rem)

    def test_sequence_ends_with_stage(self, sequence, test_rem):
        expected_latency = EPOCH_DURATION * (len(sequence) - 1)
        self.assert_latency_equals_expected(expected_latency, sequence, test_rem)

    def test_sequence_with_stage_at_middle(self, sequence, test_rem, latency):
        self.assert_latency_equals_expected(latency, sequence, test_rem)

    def assert_latency_equals_expected(self, expected, sequence, test_rem):
        sequence = convert_sleep_stage_name_to_values(sequence)
        response = ClassificationResponse(self.MOCK_REQUEST, sequence, None)
        report = response.report

        assert report[self.get_report_key(test_rem)] == expected


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
    "stageShifts": 89, // number of times the subject transitionned
                       // from one stage to another between sleep onset & offset
    """
    params = {
    }
