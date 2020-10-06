SLEEP_STAGES_VALUES = {
    "W": 0,
    "N1": 1,
    "N2": 2,
    "N3": 3,
    "REM": 4
}
N_STAGES = len(SLEEP_STAGES_VALUES.keys())

EEG_CHANNELS = [
    'EEG Fpz-Cz',
    'EEG Pz-Oz'
]

EPOCH_DURATION = 30  # in seconds

DATASET_SAMPLE_RATE = 100           # in Hz
OPENBCI_CYTON_SAMPLE_RATE = 250     # in Hz
OPENBCI_GANGLION_SAMPLE_RATE = 200  # in Hz

AGE_FEATURE_BINS = [
    [0, 49],
    [50, 59],
    [60, 84],
    [85, 110]
]
