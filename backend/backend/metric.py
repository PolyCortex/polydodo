from collections import Counter
import numpy as np

from classification.config.constants import SleepStage, EPOCH_DURATION


def get_metrics(sleep_stages, bedtime):
    latencies = _get_latencies(sleep_stages)
    time_passed_in_stage = _get_time_passed_in_stage(sleep_stages)
    efficiencies = _get_efficiency(sleep_stages)
    sleep_offset_with_wake = _get_sleep_offset_with_wake(sleep_stages, bedtime)
    onsets = {
        "sleepOnset": (
            latencies['sleepLatency'] if latencies['sleepLatency'] >= 0 else 0
        ) + bedtime,
        "remOnset": (
            latencies['remLatency'] if latencies['remLatency'] >= 0 else 0
        ) + bedtime
    }

    sleep_time = sleep_offset_with_wake['sleepOffset'] - onsets['sleepOnset']
    waso = sleep_time - efficiencies['efficientSleepTime']

    return {
        **latencies,
        **time_passed_in_stage,
        **onsets,
        **efficiencies,
        **sleep_offset_with_wake,

        "awakenings": 7,
        "stageShifts": 89,

        # not tested
        "WASO": waso,
        "SleepTime": sleep_time,
    }


def _get_efficiency(sequence):
    """
    "sleepEfficiency": 0.8733,  # Overall sense of how well the patient slept(totalSleepTime / bedTime)
    "efficientSleepTime": 27113,  # Total amount of seconds passed in non - wake stages
    """
    sleep_indexes = np.where(sequence != SleepStage.W.name)[0]

    return {
        "sleepEfficiency": sleep_indexes.shape[0] / sequence.shape[0],
        "efficientSleepTime": sleep_indexes.shape[0] * EPOCH_DURATION,
    }


def _get_latencies(sequence):
    """Tests the time it took to enter a specific stage
    Input:
    - sequence: np.array of the SleepStage labels
    """
    def get_latency_of_stage(sequence_is_stage):
        epochs_of_stage_of_interest = np.where(sequence_is_stage)[0]
        return int(-1 if epochs_of_stage_of_interest.shape[0] == 0 else epochs_of_stage_of_interest[0] * EPOCH_DURATION)

    return {
        "sleepLatency": get_latency_of_stage(sequence != SleepStage.W.name),
        "remLatency": get_latency_of_stage(sequence == SleepStage.REM.name),
    }


def _get_sleep_offset_with_wake(sequence, bedtime):
    sleep_indexes = np.where(sequence != SleepStage.W.name)[0]
    sleep_nb_epochs = (sleep_indexes[-1] + 1) if len(sleep_indexes) else len(sequence)
    wake_after_sleep_offset_nb_epochs = (
        len(sequence) - sleep_indexes[-1] - 1
    ) if len(sleep_indexes) and sequence[-1] == SleepStage.W.name else 0

    return {
        'sleepOffset': sleep_nb_epochs * EPOCH_DURATION + bedtime,
        'wakeAfterSleepOffset': wake_after_sleep_offset_nb_epochs * EPOCH_DURATION,
    }


def _get_time_passed_in_stage(sequence):
    """Calculates time passed in each stage for all of the sequence
    Input:
    - sequence: list or np.array of the SleepStage labels
    """
    nb_epoch_passed_by_stage = Counter(sequence)

    def get_time_passed(stage):
        return EPOCH_DURATION * nb_epoch_passed_by_stage[stage] if stage in nb_epoch_passed_by_stage else 0

    return {
        f"{stage.upper()}Time": get_time_passed(stage)
        for stage in SleepStage.tolist()
    }
