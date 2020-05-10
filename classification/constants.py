## Sleep label values ##
SLEEP_STAGES_VALUES = {
    "W": 0,
    "N1": 1,
    "N2": 2,
    "N3": 3,
    "REM": 4
}

DATASET_SLEEP_STAGES_VALUES = {
    'Sleep stage W': SLEEP_STAGES_VALUES["W"],
    'Sleep stage 1': SLEEP_STAGES_VALUES["N1"],
    'Sleep stage 2': SLEEP_STAGES_VALUES["N2"],
    'Sleep stage 3': SLEEP_STAGES_VALUES["N3"],
    'Sleep stage 4': SLEEP_STAGES_VALUES["N3"],
    'Sleep stage R': SLEEP_STAGES_VALUES["REM"]
}

N_STAGES = len(SLEEP_STAGES_VALUES.keys())
########################

## Recordings info ##
EEG_CHANNELS = [
    'EEG Fpz-Cz',
    'EEG Pz-Oz'
]

EPOCH_DURATION = 30. # in seconds
SAMPLING_FREQ = 100
#####################