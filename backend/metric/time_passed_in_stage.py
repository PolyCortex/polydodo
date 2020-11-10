from collections import Counter
from classification.config.constants import SleepStage, EPOCH_DURATION


def get_time_passed_in_stage(sequence):
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
