import numpy as np

from classification.config.constants import SleepStage, EPOCH_DURATION


def get_sleep_offset(sequence, bedtime):
    sleep_indexes = np.where(sequence != SleepStage.W.name)[0]
    sleep_nb_epochs = (sleep_indexes[-1] + 1) if len(sleep_indexes) else len(sequence)

    # Time at which the subject woke up(time of the epoch after the last non - wake epoch)
    return {'sleepOffset': sleep_nb_epochs * EPOCH_DURATION + bedtime}
