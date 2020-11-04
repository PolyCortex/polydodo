from enum import Enum, auto


class Sex(Enum):
    # based from subject description file (see header)
    #  https://physionet.org/content/sleep-edfx/1.0.0/SC-subjects.xls
    F = 1
    M = 2


class HiddenMarkovModelProbability(Enum):
    emission = auto()
    start = auto()
    transition = auto()

    def get_filename(self):
        return f'hmm_{self.name}_probabilities.npy'


ALLOWED_FILE_EXTENSIONS = ('.txt', '.csv')

EEG_CHANNELS = [
    'EEG Fpz-Cz',
    'EEG Pz-Oz'
]

EPOCH_DURATION = 30
FILE_MINIMUM_DURATION = EPOCH_DURATION

DATASET_SAMPLE_RATE = 100
OPENBCI_CYTON_SAMPLE_RATE = 250
OPENBCI_GANGLION_SAMPLE_RATE = 200

AGE_FEATURE_BINS = [
    [12, 49],
    [50, 59],
    [60, 84],
    [85, 125]
]
ACCEPTED_AGE_RANGE = [AGE_FEATURE_BINS[0][0], AGE_FEATURE_BINS[-1][-1]]

N_STAGES = 5

HMM_EMISSION_MATRIX = 'emission'
HMM_START_PROBABILITIES = 'start'
HMM_TRANSITION_MATRIX = 'transition'
