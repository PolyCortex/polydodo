"""
Not tested as they seemed obvious:
- "SleepTime": 31045, // Total amount of time sleeping including nocturnal awakenings (sleepOffset - sleepOnset)
- "WASO": 3932, // Total amount of time passed in nocturnal awakenings. It is the total time passed in non-wake stage
                // from sleep Onset to sleep offset (totalSleepTime - efficientSleepTime)
"""

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


class TestReportLatenciesOnset():
    """Tests the event-related latencies and onsets
    The evaluated metrics are:
    "sleepLatency": 1000, // Time to fall asleep [seconds] (sleepOnset - bedTime)
    "remLatency": 3852, // [seconds] (remOnset- bedTime)

    "sleepOnset": 1602211380, // Time at which the subject fell asleep (time of the first non-wake epoch)
    "remOnset": 1602214232, // First REM epoch
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

    def test_sequence_starts_with_stage(self, sequence, test_rem):
        expected_latency = 0
        expected_onset = self.MOCK_REQUEST.bedtime
        self.assert_latency_equals_expected(expected_latency, expected_onset, sequence, test_rem)

    def test_sequence_has_no_stage(self, sequence, test_rem):
        expected_latency = -1
        expected_onset = self.MOCK_REQUEST.bedtime
        self.assert_latency_equals_expected(expected_latency, expected_onset, sequence, test_rem)

    def test_sequence_ends_with_stage(self, sequence, test_rem):
        expected_latency = EPOCH_DURATION * (len(sequence) - 1)
        expected_onset = expected_latency + self.MOCK_REQUEST.bedtime
        self.assert_latency_equals_expected(expected_latency, expected_onset, sequence, test_rem)

    def test_sequence_with_stage_at_middle(self, sequence, test_rem, latency):
        expected_onset = latency + self.MOCK_REQUEST.bedtime
        self.assert_latency_equals_expected(latency, expected_onset, sequence, test_rem)

    def get_latency_report_key(self, test_rem):
        return 'remLatency' if test_rem else 'sleepLatency'

    def get_onset_report_key(self, test_rem):
        return 'remOnset' if test_rem else 'sleepOnset'

    def assert_latency_equals_expected(self, expected_latency, expected_onset, sequence, test_rem):
        sequence = convert_sleep_stage_name_to_values(sequence)
        response = ClassificationResponse(self.MOCK_REQUEST, sequence, None)
        report = response.report

        assert report[self.get_latency_report_key(test_rem)] == expected_latency, (
            f"Latency of {'rem' if test_rem else 'sleep'} is not as expected"
        )
        assert report[self.get_onset_report_key(test_rem)] == expected_onset, (
            f"Onset of {'rem' if test_rem else 'sleep'} is not as expected"
        )


class TestReportSleepOffset():
    """Tests timestamp at which user woke up
    "sleepOffset": 1602242425, // Time at which the subject woke up (time of the epoch after the last non-wake epoch)
    """
    params = {
        'test_wake_up_end': [dict(
            sequence=['W', 'N1', 'N2', 'N3', 'REM', 'N1', 'W'],
        )], 'test_wake_up_middle': [dict(
            sequence=['W', 'N1', 'N2', 'W', 'W', 'W', 'W'],
            awake_index=3,
            expected_wake_after_sleep_offset=4 * EPOCH_DURATION,
        )], 'test_awakes_and_goes_back_to_sleep_and_wakes': [dict(
            sequence=['W', 'N1', 'N2', 'W', 'N1', 'N2', 'W'],
            awake_index=6,
            expected_wake_after_sleep_offset=EPOCH_DURATION,
        )], 'test_awakes_and_goes_back_to_sleep_and_doesnt_awake': [dict(
            sequence=['W', 'N1', 'N2', 'W', 'N1', 'N2', 'N2'],
        )], 'test_always_awake': [
            dict(sequence=['W', 'W', 'W']),
            dict(sequence=['W']),
        ], 'test_doesnt_awaken': [
            dict(sequence=['W', 'N1', 'N2']),
            dict(sequence=['N1', 'N1', 'N2']),
        ],
    }

    @classmethod
    def setup_class(cls):
        cls.MOCK_REQUEST = get_mock_request()

    def test_wake_up_end(self, sequence):
        expected_sleep_offset = self.MOCK_REQUEST.bedtime + EPOCH_DURATION * (len(sequence) - 1)
        expected_wake_after_sleep_offset = EPOCH_DURATION
        self.assert_sleep_offset_with_wake(sequence, expected_sleep_offset, expected_wake_after_sleep_offset)

    def test_wake_up_middle(self, sequence, awake_index, expected_wake_after_sleep_offset):
        expected_sleep_offset = self.MOCK_REQUEST.bedtime + EPOCH_DURATION * awake_index
        self.assert_sleep_offset_with_wake(sequence, expected_sleep_offset, expected_wake_after_sleep_offset)

    def test_awakes_and_goes_back_to_sleep_and_wakes(self, sequence, awake_index, expected_wake_after_sleep_offset):
        expected_sleep_offset = self.MOCK_REQUEST.bedtime + EPOCH_DURATION * awake_index
        self.assert_sleep_offset_with_wake(sequence, expected_sleep_offset, expected_wake_after_sleep_offset)

    def test_awakes_and_goes_back_to_sleep_and_doesnt_awake(self, sequence):
        expected_sleep_offset = self.MOCK_REQUEST.bedtime + EPOCH_DURATION * len(sequence)
        expected_wake_after_sleep_offset = 0
        self.assert_sleep_offset_with_wake(sequence, expected_sleep_offset, expected_wake_after_sleep_offset)

    def test_always_awake(self, sequence):
        expected_sleep_offset = self.MOCK_REQUEST.bedtime + EPOCH_DURATION * len(sequence)
        expected_wake_after_sleep_offset = 0
        self.assert_sleep_offset_with_wake(sequence, expected_sleep_offset, expected_wake_after_sleep_offset)

    def test_doesnt_awaken(self, sequence):
        expected_sleep_offset = self.MOCK_REQUEST.bedtime + EPOCH_DURATION * len(sequence)
        expected_wake_after_sleep_offset = 0
        self.assert_sleep_offset_with_wake(sequence, expected_sleep_offset, expected_wake_after_sleep_offset)

    def assert_sleep_offset_with_wake(self, sequence, expected_sleep_offset, expected_wake_after_sleep_offset):
        sequence = convert_sleep_stage_name_to_values(sequence)
        response = ClassificationResponse(self.MOCK_REQUEST, sequence, None)
        report = response.report

        assert report['sleepOffset'] == expected_sleep_offset
        assert report['wakeAfterSleepOffset'] == expected_wake_after_sleep_offset


class TestReportSleepEfficiency():
    """Tests sleep efficiency related metrics
    The evaluated metrics are:
    "sleepEfficiency": 0.8733, // Overall sense of how well the patient slept (totalSleepTime/bedTime)
    "efficientSleepTime": 27113, // Total amount of seconds passed in non-wake stages
    """
    params = {
        'test_sleep_time_null': [
            dict(sequence=['W', 'W', 'W']),
            dict(sequence=['W']),
        ], 'test_sleep_time_not_null': [
            dict(
                sequence=['W', 'W', 'N1', 'W'],
                expected_efficiency=(1 / 4),
                expected_efficient_sleep_time=EPOCH_DURATION
            ), dict(
                sequence=['W', 'W', 'N2', 'W'],
                expected_efficiency=(1 / 4),
                expected_efficient_sleep_time=EPOCH_DURATION
            ), dict(
                sequence=['W', 'W', 'N3', 'W'],
                expected_efficiency=(1 / 4),
                expected_efficient_sleep_time=EPOCH_DURATION
            ), dict(
                sequence=['W', 'W', 'REM', 'W'],
                expected_efficiency=(1 / 4),
                expected_efficient_sleep_time=EPOCH_DURATION
            ), dict(
                sequence=['W', 'W', 'N1', 'N2', 'N3', 'REM', 'N1', 'W'],
                expected_efficiency=(5 / 8),
                expected_efficient_sleep_time=5 * EPOCH_DURATION
            ),
        ]
    }

    @classmethod
    def setup_class(cls):
        cls.MOCK_REQUEST = get_mock_request()

    def test_sleep_time_null(self, sequence):
        self.assert_sleep_efficiency(sequence, expected_efficiency=0, expected_efficient_sleep_time=0)

    def test_sleep_time_not_null(self, sequence, expected_efficiency, expected_efficient_sleep_time):
        self.assert_sleep_efficiency(sequence, expected_efficiency, expected_efficient_sleep_time)

    def assert_sleep_efficiency(self, sequence, expected_efficiency, expected_efficient_sleep_time):
        sequence = convert_sleep_stage_name_to_values(sequence)
        response = ClassificationResponse(self.MOCK_REQUEST, sequence, None)
        report = response.report

        assert report['sleepEfficiency'] == expected_efficiency
        assert report['efficientSleepTime'] == expected_efficient_sleep_time


# class TestReportAwakenings():
#     """Tests number of awakenings per night
#     "awakenings": 7, // number of times the subject woke up between sleep onset & offset
#     """
#     params = {
#         'test_sleep_time_null': [
#             dict(sequence=['W', 'W', 'W']),
#             dict(sequence=['W']),
#         ], 'test_one_awakening': [
#             dict(sequence=['W', 'N1', 'W']),
#             dict(sequence=['W', 'N1', 'N2', 'N3', 'W', 'W']),
#         ], 'test_doesnt_awaken': [
#             dict(sequence=['W', 'N1', 'N2', 'N3', 'REM']),
#             dict(sequence=['W', 'N1']),
#         ], 'test_many_awakening': [
#             dict(sequence=['W', 'N1', 'W', 'N1', 'W'], nb_awakenings=2),
#             dict(sequence=['W', 'N1', 'N2', 'W', 'N1', 'W', 'W', 'N1', 'W'], nb_awakenings=3),
#         ],
#     }

#     @classmethod
#     def setup_class(cls):
#         cls.MOCK_REQUEST = get_mock_request()

#     def test_sleep_time_null(self, sequence):
#         self.assert_sleep_efficiency(sequence, expected_nb_awakenings=0)

#     def test_one_awakening(self, sequence):
#         self.assert_sleep_efficiency(sequence, expected_nb_awakenings=1)

#     def test_doesnt_awaken(self, sequence):
#         self.assert_sleep_efficiency(sequence, expected_nb_awakenings=1)

#     def test_many_awakening(self, sequence, nb_awakenings):
#         self.assert_sleep_efficiency(sequence, expected_nb_awakenings=nb_awakenings)

#     def assert_sleep_efficiency(self, sequence, expected_nb_awakenings):
#         sequence = convert_sleep_stage_name_to_values(sequence)
#         response = ClassificationResponse(self.MOCK_REQUEST, sequence, None)
#         report = response.report

#         assert report['awakenings'] == expected_nb_awakenings


class TestReportStageShifts():
    """Test number of stage shifts per night
    "stageShifts": 89, // number of times the subject transitionned
                       // from one stage to another between sleep onset & offset
    """
    params = {
        'test_sleep_time_null': [
            dict(sequence=['W', 'W', 'W']),
            dict(sequence=['W']),
        ], 'test_one_sleep_stage': [
            dict(sequence=['W', 'W', 'N1', 'N1', 'N1', 'W']),
            dict(sequence=['W', 'N1', 'W']),
        ], 'test_sleep_with_awakenings': [
            dict(sequence=['W', 'N1', 'W', 'N1', 'N1', 'W'], sleep_shifts=4),
            dict(sequence=['W', 'N1', 'W', 'N2', 'W', 'N3', 'W'], sleep_shifts=6),
        ], 'test_does_not_awaken': [
            dict(sequence=['W', 'N1', 'N1'], sleep_shifts=2),
            dict(sequence=['W', 'N1', 'N2'], sleep_shifts=3),
            dict(sequence=['W', 'N1', 'N3'], sleep_shifts=3),
            dict(sequence=['W', 'N1', 'REM'], sleep_shifts=3),
        ], 'test_many_sleep_stages': [
            dict(sequence=['W', 'N1', 'N2', 'N2', 'W'], sleep_shifts=3),
            dict(sequence=['W', 'N1', 'N1', 'N3', 'N3', 'REM', 'REM', 'N1', 'W'], sleep_shifts=5),
        ],
    }

    @classmethod
    def setup_class(cls):
        cls.MOCK_REQUEST = get_mock_request()

    def test_sleep_time_null(self, sequence):
        self.assert_sleep_efficiency(sequence, expected_sleep_shifts=0)

    def test_one_sleep_stage(self, sequence):
        self.assert_sleep_efficiency(sequence, expected_sleep_shifts=2)

    def test_sleep_with_awakenings(self, sequence, sleep_shifts):
        self.assert_sleep_efficiency(sequence, expected_sleep_shifts=sleep_shifts)

    def test_does_not_awaken(self, sequence, sleep_shifts):
        self.assert_sleep_efficiency(sequence, expected_sleep_shifts=sleep_shifts)

    def test_many_sleep_stages(self, sequence, sleep_shifts):
        self.assert_sleep_efficiency(sequence, expected_sleep_shifts=sleep_shifts)

    def assert_sleep_efficiency(self, sequence, expected_sleep_shifts):
        sequence = convert_sleep_stage_name_to_values(sequence)
        response = ClassificationResponse(self.MOCK_REQUEST, sequence, None)
        report = response.report

        assert report['stageShifts'] == expected_sleep_shifts
