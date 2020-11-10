
from tests.setup import pytest_generate_tests  # noqa: F401
from tests.setup import get_mock_request
from backend.response import ClassificationResponse
from classification.config.constants import EPOCH_DURATION, SleepStage

SLEEP_STAGE_NAMES = [e.name for e in SleepStage]


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
                sequence=[
                    'W',
                    'W',
                    'W'],
                WTime=3 * EPOCH_DURATION,
                REMTime=0,
                N1Time=0,
                N2Time=0,
                N3Time=0),
            dict(
                sequence=[
                    'REM',
                    'REM',
                    'REM'],
                WTime=0,
                REMTime=3 * EPOCH_DURATION,
                N1Time=0,
                N2Time=0,
                N3Time=0),
            dict(
                sequence=[
                    'N1',
                    'N1',
                    'N1'],
                WTime=0,
                REMTime=0,
                N1Time=3 * EPOCH_DURATION,
                N2Time=0,
                N3Time=0),
            dict(
                sequence=[
                    'N2',
                    'N2',
                    'N2'],
                WTime=0,
                REMTime=0,
                N1Time=0,
                N2Time=3 * EPOCH_DURATION,
                N3Time=0),
            dict(
                sequence=[
                    'N3',
                    'N3',
                    'N3'],
                WTime=0,
                REMTime=0,
                N1Time=0,
                N2Time=0,
                N3Time=3 * EPOCH_DURATION),
        ], "test_partial_time_passed_in_stage": [
            dict(
                sequence=[
                    'W',
                    'N1',
                    'N2',
                    'W'],
                WTime=2 * EPOCH_DURATION,
                REMTime=0,
                N1Time=EPOCH_DURATION,
                N2Time=EPOCH_DURATION,
                N3Time=0),
            dict(
                sequence=[
                    'N1',
                    'W',
                    'W'],
                WTime=2 * EPOCH_DURATION,
                REMTime=0,
                N1Time=EPOCH_DURATION,
                N2Time=0,
                N3Time=0),
            dict(
                sequence=[
                    'W',
                    'N1',
                    'N2',
                    'N3',
                    'REM',
                    'W'],
                WTime=2 * EPOCH_DURATION,
                REMTime=EPOCH_DURATION,
                N1Time=EPOCH_DURATION,
                N2Time=EPOCH_DURATION,
                N3Time=EPOCH_DURATION),
            dict(
                sequence=[
                    'N1',
                    'N2',
                    'N2',
                    'REM'],
                WTime=0,
                REMTime=EPOCH_DURATION,
                N1Time=EPOCH_DURATION,
                N2Time=2 * EPOCH_DURATION,
                N3Time=0),
        ]
    }

    @classmethod
    def setup_class(cls):
        """ setup any state specific to the execution of the given class (which
        usually contains tests).
        """
        cls.MOCK_REQUEST = get_mock_request()

    def test_null_time_passed_in_stage(self, sequence, WTime, REMTime, N1Time, N2Time, N3Time):
        response = ClassificationResponse(self.MOCK_REQUEST, sequence, None)
        report = response.report

        assert report[sequence[0].upper() + 'Time'] == len(sequence) * EPOCH_DURATION
        self.assert_times(sequence, report, WTime, REMTime, N1Time, N2Time, N3Time)

    def test_partial_time_passed_in_stage(self, sequence, WTime, REMTime, N1Time, N2Time, N3Time):
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
    "stageShifts": 89, // number of times the subject transitionned
                       // from one stage to another between sleep onset & offset
    """
    params = {
    }
