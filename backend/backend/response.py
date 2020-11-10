import numpy as np

from classification.config.constants import EPOCH_DURATION, SleepStage

from metric.time_passed_in_stage import get_time_passed_in_stage
from metric.latency import get_latencies
from metric.offset import get_sleep_offset


class ClassificationResponse():
    def __init__(self, request, predictions, spectrogram):
        self.sex = request.sex
        self.age = request.age
        self.stream_start = request.stream_start
        self.stream_duration = request.stream_duration
        self.bedtime = request.bedtime
        self.wakeup = request.wakeup
        self.board = request.board
        self.n_epochs = request.n_epochs

        self.spectrogram = spectrogram
        self.predictions = predictions

    @property
    def sleep_stages(self):
        ordered_sleep_stage_names = np.array(SleepStage.tolist())
        return ordered_sleep_stage_names[self.predictions]

    @property
    def epochs(self):
        timestamps = np.arange(self.n_epochs * EPOCH_DURATION, step=EPOCH_DURATION) + self.bedtime
        return {'timestamps': timestamps.tolist(), 'stages': self.sleep_stages.tolist()}

    @property
    def metadata(self):
        return {
            "sessionStartTime": self.stream_start,
            "sessionEndTime": self.stream_duration + self.stream_start,
            "totalSessionTime": self.stream_duration,
            "bedTime": self.bedtime,
            "wakeUpTime": self.wakeup,
            "totalBedTime": self.wakeup - self.bedtime,
        }

    @property
    def subject(self):
        return {
            'age': self.age,
            'sex': self.sex.name,
        }

    @property
    def report(self):
        latencies = get_latencies(self.sleep_stages)
        time_passed_in_stage = get_time_passed_in_stage(self.sleep_stages)
        onsets = {
            "sleepOnset": (
                latencies['sleepLatency'] if latencies['sleepLatency'] >= 0 else 0
            ) + self.bedtime,
            "remOnset": (
                latencies['remLatency'] if latencies['remLatency'] >= 0 else 0
            ) + self.bedtime
        }

        return {
            **latencies,
            **time_passed_in_stage,
            **onsets,
            **get_sleep_offset(self.sleep_stages, self.bedtime),

            "sleepEfficiency": 0.8733,  # Overall sense of how well the patient slept(totalSleepTime / bedTime)
            "awakenings": 7,  # number of times the subject woke up between sleep onset & offset
            # number of times the subject transitionned from one stage to another between sleep onset & offset
            "stageShifts": 89,

            "wakeAfterSleepOffset": 500,  # [seconds](wakeUpTime - sleepOffset)
            "efficientSleepTime": 27113,  # Total amount of seconds passed in non - wake stages
            # Total amount of time passed in nocturnal awakenings. It is the total
            # time passed in non - wake stage from sleep Onset to sleep
            # offset(totalSleepTime - efficientSleepTime)
            "WASO": 3932,
            "SleepTime": 31045,
        }

    @property
    def response(self):
        return {
            'epochs': self.epochs,
            'report': self.report,
            'metadata': self.metadata,
            'subject': self.subject,
            'board': self.board.name,
            'spectrograms': self.spectrogram,
        }
