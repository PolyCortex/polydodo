from collections import Counter
import numpy as np

from classification.config.constants import SleepStage, EPOCH_DURATION


def get_metrics(sleep_stages, bedtime):
    independent_metrics = {
        **_get_rem_latency(sleep_stages),
        **_get_time_passed_in_stage(sleep_stages),
        **_get_sleep_vs_wake_metrics(sleep_stages, bedtime),
        **_get_stage_shifts(sleep_stages)
    }
    onsets = _get_onsets(independent_metrics, bedtime)
    sleep_time = independent_metrics['sleepOffset'] - onsets['sleepOnset']
    waso = dict(WASO=sleep_time - independent_metrics['efficientSleepTime'])

    return {
        **independent_metrics,
        **onsets,
        # not tested
        **waso,
        "SleepTime": sleep_time,

        "awakenings": 7,
    }


def _get_sleep_vs_wake_metrics(sequence, bedtime):
    """
    "sleepEfficiency": 0.8733,  # Overall sense of how well the patient slept(totalSleepTime / bedTime)
    "efficientSleepTime": 27113,  # Total amount of seconds passed in non - wake stages
    """
    sleep_condition = sequence != SleepStage.W.name
    sleep_indexes = np.where(sleep_condition)[0]

    return {
        "sleepEfficiency": sleep_indexes.shape[0] / sequence.shape[0],
        "efficientSleepTime": sleep_indexes.shape[0] * EPOCH_DURATION,
        "sleepLatency": _get_latency_of_stage(sleep_condition),
        **_get_sleep_offset_with_wake(sleep_indexes, sequence, bedtime)
    }


def _get_sleep_offset_with_wake(sleep_indexes, sequence, bedtime):
    sleep_nb_epochs = (sleep_indexes[-1] + 1) if len(sleep_indexes) else len(sequence)
    wake_after_sleep_offset_nb_epochs = (
        len(sequence) - sleep_indexes[-1] - 1
    ) if len(sleep_indexes) and sequence[-1] == SleepStage.W.name else 0

    return {
        'sleepOffset': sleep_nb_epochs * EPOCH_DURATION + bedtime,
        'wakeAfterSleepOffset': wake_after_sleep_offset_nb_epochs * EPOCH_DURATION,
    }


def _get_rem_latency(sequence):
    """Tests the time it took to enter a specific stage
    Input:
    - sequence: np.array of the SleepStage labels
    """

    return {
        "remLatency": _get_latency_of_stage(sequence == SleepStage.REM.name),
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


def _get_stage_shifts(sequence):
    consecutive_stages_occurences = Counter(zip(sequence[1:], sequence[:-1]))
    transition_occurences = [
        consecutive_stages_occurences[consecutive_stages]
        for consecutive_stages in consecutive_stages_occurences if consecutive_stages[0] != consecutive_stages[1]
    ]
    nb_stage_shifts = sum(transition_occurences)

    is_last_stage_sleep = sequence[-1] != SleepStage.W.name
    has_slept = len(np.unique(sequence)) != 1 or np.unique(sequence)[0] != SleepStage.W.name
    if is_last_stage_sleep and has_slept:
        nb_stage_shifts += 1

    return dict(stageShifts=nb_stage_shifts)


def _get_onsets(independent_metrics, bedtime):
    return {
        "sleepOnset": (
            independent_metrics['sleepLatency'] if independent_metrics['sleepLatency'] >= 0 else 0
        ) + bedtime,
        "remOnset": (
            independent_metrics['remLatency'] if independent_metrics['remLatency'] >= 0 else 0
        ) + bedtime
    }


def _get_latency_of_stage(sequence_is_stage):
    epochs_of_stage_of_interest = np.where(sequence_is_stage)[0]
    return int(-1 if epochs_of_stage_of_interest.shape[0] == 0 else epochs_of_stage_of_interest[0] * EPOCH_DURATION)
