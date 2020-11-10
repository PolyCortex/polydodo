import numpy as np

from classification.config.constants import SleepStage, EPOCH_DURATION


def get_latencies(sequence):
    """Tests the time it took to enter a specific stage
    Input:
    - sequence: np.array of the SleepStage labels
    """
    return {
        "sleepLatency": _get_latency_of_stage(sequence != SleepStage.W.name),
        "remLatency": _get_latency_of_stage(sequence == SleepStage.REM.name),
    }


def _get_latency_of_stage(sequence_is_stage):
    epochs_of_stage_of_interest = np.where(sequence_is_stage)[0]
    return -1 if epochs_of_stage_of_interest.shape[0] == 0 else epochs_of_stage_of_interest[0] * EPOCH_DURATION
