import mne
from scipy.signal import cheby1

from classification.config.constants import (
    # TODO: adapt pipeline to adjust whether data is being sent from ganglion or cyton
    OPENBCI_CYTON_SAMPLE_RATE,
)
from classification.features.constants import (
    EPOCH_DURATION,
    DATASET_SAMPLE_RATE,
    DATASET_HIGH_PASS_FREQ,
    HIGH_PASS_FILTER_ORDER,
    HIGH_PASS_MAX_RIPPLE_DB,
)


def preprocess(raw_data, channel, bed_seconds, out_of_bed_seconds):
    """Returns preprocessed epochs of the specified channel
    Input
    -------
    raw_data: instance of mne.Raw
    channel: channel to preprocess
    bed_seconds: number of seconds between start of recording & moment at
        which the subjet went to bed (in seconds)
    out_of_bed_seconds: number of seconds between start of recording & moment
        at which the subjet got out of bed (in seconds)
    """
    raw_data = raw_data.copy()

    raw_data = _drop_other_channels(raw_data, channel)
    raw_data = _crop_raw_data(raw_data, bed_seconds, out_of_bed_seconds)
    raw_data = _apply_high_pass_filter(raw_data)
    raw_data = raw_data.resample(DATASET_SAMPLE_RATE)
    raw_data = _convert_to_epochs(raw_data)

    return raw_data


def _drop_other_channels(raw_data, channel_to_keep):
    """returns mne.Raw with only the channel to keep"""
    raw_data.drop_channels(
        [ch for ch in raw_data.info['ch_names'] if ch != channel_to_keep])

    return raw_data


def _crop_raw_data(
    raw_data,
    bed_seconds,
    out_of_bed_seconds
):
    """Returns cropped raw signal
    Input
    -------
    raw_data: instance of mne.Raw
    bed_seconds: number of seconds between start of recording & moment at
        which the subjet went to bed (in seconds)
    out_of_bed_seconds: number of seconds between start of recording & moment
        at which the subjet got out of bed (in seconds)
    """
    raw_data.crop(
        tmin=bed_seconds,
        tmax=out_of_bed_seconds,
        include_tmax=False,
    )

    return raw_data


def _apply_high_pass_filter(raw_data):
    """Returns high passed raw signal
    Input
    -------
    raw_data: instance of mne.Raw
    """
    b, a = cheby1(
        HIGH_PASS_FILTER_ORDER,
        HIGH_PASS_MAX_RIPPLE_DB,
        DATASET_HIGH_PASS_FREQ,
        fs=OPENBCI_CYTON_SAMPLE_RATE,
        btype='highpass',
    )
    raw_data.filter(
        l_freq=DATASET_HIGH_PASS_FREQ,
        h_freq=None,
        method='iir',
        iir_params={'b': b, 'a': a},
    )

    return raw_data


def _convert_to_epochs(raw_data):
    """Converts the raw object to an Epochs
    Input:
    - raw_data: instance of mne.RawArray, that has been previously cropped to tmin=in_bed_time
    returns: mne.Epochs
    """
    return mne.make_fixed_length_epochs(
        raw=raw_data,
        duration=EPOCH_DURATION,
        preload=True,
        verbose=False,
    )
