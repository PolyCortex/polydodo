import numpy as np
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.preprocessing import (FunctionTransformer)

from classification.features.pipeline.utils import (
    get_psds_from_epochs_transformer,
)
from classification.features.constants import (
    FREQ_BANDS_RANGE,
)


def get_mean_psds(psds_with_freqs, are_relative=False):
    """EEG power band feature extraction.
    Input
    -------
    psds_with_freqs: tuple which contains
            - (nb_epochs, nb_chan=1, nb_freqs) psds amplitudes
            - (nb_freqs,) corresponding frequency values

    are_relative: boolean which indicates if the mean band powers
        for each subband are relative to the total power or not.

    Returns
    -------
    X : numpy array of shape [n_samples, nb_subband=5]
        Transformed data.
    """
    psds = psds_with_freqs[0]
    freqs = psds_with_freqs[1]

    if are_relative:
        psds /= np.sum(psds, axis=-1, keepdims=True)

    X = []
    for fmin, fmax in FREQ_BANDS_RANGE.values():
        psds_band = psds[:, :, (freqs >= fmin) & (freqs < fmax)].mean(axis=-1)
        X.append(psds_band.reshape(len(psds), -1))

    return np.concatenate(X, axis=1)


def get_sefd_on_all_epochs(psds_with_freqs):
    """SEFd on all epochs
    """
    SUBBAND_FREQ_SEFD = [8., 16.]

    psds = psds_with_freqs[0].squeeze()
    freqs = psds_with_freqs[1]

    psds = psds[:, (freqs >= SUBBAND_FREQ_SEFD[0])
                & (freqs < SUBBAND_FREQ_SEFD[1])]
    freqs = freqs[(freqs >= SUBBAND_FREQ_SEFD[0])
                  & (freqs < SUBBAND_FREQ_SEFD[1])]

    def get_sefd(psd, freqs):
        """Spectral edge frequency difference
        Input
        -------
        psd: array of the power spectrum density for one epoch
        freqs: array of the frequencies

        Returns
        -------
        Difference between the frequencies under which
        cumulates 95 and 50 percent of the power
        """
        assert len(psd) == len(
            freqs), "All PSD value must have a corresponding frequency value"

        CUMUL_POWER_RATIO = [0.50, 0.95]

        total_power = np.sum(psd)
        cumul_power = 0

        lower_freq = None
        upper_freq = None

        for amp, freq in zip(psd, freqs):
            cumul_power += amp
            if cumul_power >= CUMUL_POWER_RATIO[1] * total_power:
                upper_freq = freq
                break
            elif lower_freq is None and cumul_power >= CUMUL_POWER_RATIO[0] * total_power:
                lower_freq = freq

        return upper_freq - lower_freq

    return [[get_sefd(one_epoch_psd, freqs)] for one_epoch_psd in psds]


def get_frequency_domain_pipeline():
    absolute_mean_psds_transformer = FunctionTransformer(
        get_mean_psds, validate=False)
    relative_mean_psds_transformer = FunctionTransformer(
        lambda psds_with_freq: get_mean_psds(
            psds_with_freq,
            are_relative=True
        ), validate=False)

    sefd_transformer = FunctionTransformer(
        get_sefd_on_all_epochs, validate=False)

    return Pipeline([
        ('get_psds_from_epochs', get_psds_from_epochs_transformer),
        ('frequency_domain_features', FeatureUnion([
            ('absolute_mean_power_band', absolute_mean_psds_transformer),
            ('relative_mean_power_band', relative_mean_psds_transformer),
            ('sefd', sefd_transformer)
        ], n_jobs=1))
    ])
