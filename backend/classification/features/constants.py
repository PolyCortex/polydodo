from classification.config.constants import (
    DATASET_SAMPLE_RATE,
    EPOCH_DURATION,
)

NYQUIST_FREQ = DATASET_SAMPLE_RATE / 2

DELTA = "delta"
THETA = "theta"
ALPHA = "alpha"
SIGMA = "sigma"
BETA = "beta"

FREQ_BANDS_RANGE = {
    DELTA: [0.5, 4.5],
    THETA: [4.5, 8.5],
    ALPHA: [8.5, 11.5],
    SIGMA: [11.5, 15.5],
    BETA: [15.5, 30]
}

FREQ_BANDS_ORDERS = {
    DELTA: 5,
    THETA: 8,
    ALPHA: 9,
    SIGMA: 9,
    BETA: 14
}

DATASET_HIGH_PASS_FREQ = 0.5
HIGH_PASS_FILTER_ORDER = 6
HIGH_PASS_MAX_RIPPLE_DB = 0.2
