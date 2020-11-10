from enum import Enum, auto


class Sex(Enum):
    # based from subject description file (see header)
    #  https://physionet.org/content/sleep-edfx/1.0.0/SC-subjects.xls
    F = 1
    M = 2


class AcquisitionBoard(Enum):
    OPENBCI_CYTON = 1
    OPENBCI_GANGLION = 2


class SleepStage(Enum):
    W = 0
    N1 = 1
    N2 = 2
    N3 = 3
    REM = 4

    @staticmethod
    def tolist():
        return [e.name for e in SleepStage]


class HiddenMarkovModelProbability(Enum):
    emission = auto()
    start = auto()
    transition = auto()

    def get_filename(self):
        return f'hmm_{self.name}_probabilities.npy'


ALLOWED_FILE_EXTENSIONS = ('.txt', '.csv')

EEG_CHANNELS = [
    'Fpz-Cz',
    'Pz-Oz'
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
