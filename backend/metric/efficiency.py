import numpy as np

from classification.config.constants import SleepStage, EPOCH_DURATION


def get_efficiency(sequence):
    """
    "sleepEfficiency": 0.8733,  # Overall sense of how well the patient slept(totalSleepTime / bedTime)
    "efficientSleepTime": 27113,  # Total amount of seconds passed in non - wake stages
    """
    sleep_indexes = np.where(sequence != SleepStage.W.name)[0]

    return {
        "sleepEfficiency": sleep_indexes.shape[0] / sequence.shape[0],
        "efficientSleepTime": sleep_indexes.shape[0] * EPOCH_DURATION,
    }
