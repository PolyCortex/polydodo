import numpy as np

from classification.config.constants import EPOCH_DURATION, SleepStage


def get_labelled_epochs(predictions, start_timestamp):
    n_epochs = len(predictions)

    timestamps = np.arange(n_epochs * EPOCH_DURATION, step=EPOCH_DURATION) + start_timestamp
    ordered_sleep_stage_names = np.array([SleepStage(stage_index).name for stage_index in range(len(SleepStage))])
    stages = ordered_sleep_stage_names[predictions]

    return {'timestamps': timestamps, 'stages': stages}
