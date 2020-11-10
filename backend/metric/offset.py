import numpy as np

from classification.config.constants import SleepStage, EPOCH_DURATION


def get_sleep_offset_with_wake(sequence, bedtime):
    sleep_indexes = np.where(sequence != SleepStage.W.name)[0]
    sleep_nb_epochs = (sleep_indexes[-1] + 1) if len(sleep_indexes) else len(sequence)
    wake_after_sleep_offset_nb_epochs = (
        len(sequence) - sleep_indexes[-1] - 1
    ) if len(sleep_indexes) and sequence[-1] == SleepStage.W.name else 0

    return {
        'sleepOffset': sleep_nb_epochs * EPOCH_DURATION + bedtime,
        'wakeAfterSleepOffset': wake_after_sleep_offset_nb_epochs * EPOCH_DURATION,
    }
