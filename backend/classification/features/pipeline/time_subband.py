import numpy as np
from scipy.signal import butter
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.preprocessing import FunctionTransformer


from classification.features.constants import (
    FREQ_BANDS_ORDERS,
    FREQ_BANDS_RANGE,
    NYQUIST_FREQ,
)
from classification.features.pipeline.utils import (
    get_data_from_epochs_transformer,
    get_transformer,
)


def get_signal_mean_energy(signal):
    """
    signal: array of (nb_sample_per_epoch,)
    """
    return np.sum(signal**2) * 1e6


def get_pipeline_per_subband(subband_name: str):
    """
    Constructs a pipeline to extract the specified subband related features.
    Output:
        sklearn.pipeline.Pipeline object containing all steps to calculate time-domain feature on the specified subband.
    """

    freq_range = FREQ_BANDS_RANGE[subband_name]
    order = FREQ_BANDS_ORDERS[subband_name]

    assert len(
        freq_range) == 2, "Frequency range must only have 2 elements: [lower bound frequency, upper bound frequency]"

    bounds = [freq / NYQUIST_FREQ for freq in freq_range]
    b, a = butter(order, bounds, btype='bandpass')

    def filter_epochs_in_specified_subband(epochs):
        return epochs.copy().filter(
            l_freq=bounds[0],
            h_freq=bounds[1],
            method='iir',
            n_jobs=1,
            iir_params={
                'a': a,
                'b': b
            }, verbose=False)

    return Pipeline([
        ('filter', FunctionTransformer(filter_epochs_in_specified_subband, validate=False)),
        ('get-values', get_data_from_epochs_transformer),
        ('mean-energy', FunctionTransformer(
            get_transformer(get_signal_mean_energy), validate=True
        )),
    ])


def get_subband_feature_union():
    return FeatureUnion([(
        f"{band_name}-filter",
        get_pipeline_per_subband(band_name)
    ) for band_name in FREQ_BANDS_ORDERS.keys()], n_jobs=1)
