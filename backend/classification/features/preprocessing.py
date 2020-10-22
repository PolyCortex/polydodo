import mne
import numpy as np
from scipy.signal import cheby1

from classification.config.constants import (
    # TODO: adapt pipeline to adjust whether data is being sent from ganglion or cyton
    OPENBCI_CYTON_SAMPLE_RATE,
)
from classification.features.constants import (
    MAX_TIME,
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
    raw_data = _convert_to_epochs(raw_data, bed_seconds)

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
        tmax=min(out_of_bed_seconds, raw_data.times[-1]),
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


def _convert_to_epochs(raw_data, in_bed_time):
    """Converts the raw object to an Epochs
    Input:
    - raw_data: instance of mne.RawArray, that has been previously cropped to tmin=in_bed_time
    - in_bed_time: number of seconds between start of recording & moment at
        which the subjet went to bed (in seconds)
    returns: mne.Epochs
    """
    def get_events():
        # We must provide an event list to create an Epochs. We create a mock one, whereas
        # it has, as its first column, the sample index, and at its third column, the event id.
        # The sample index must correspond to the first sample index for each epoch (30s, not overlapping)
        # Because we will not use the event id (we will predict it), we will keep it at 0.
        # See here for more info: https://mne.tools/stable/auto_tutorials/intro/plot_20_events_from_raw.html
        # NOTE: Events indexes are considered in the time frame as before we've cropped
        # the signal. We then have to add to all values the bedtime sample index offset.
        # Otherwise, all samples prior the bedtime will be dropped, when creating the Epochs!
        sample_indexes = np.arange(raw_data.n_times) + (in_bed_time * DATASET_SAMPLE_RATE)
        nb_epochs = raw_data.n_times // (DATASET_SAMPLE_RATE * EPOCH_DURATION)
        events = np.zeros((nb_epochs, 3))
        events[:, 0] = sample_indexes[::(DATASET_SAMPLE_RATE * EPOCH_DURATION)]
        events = events.astype('int')

        print(f'Will create {nb_epochs} epochs of duration {EPOCH_DURATION} after resampling to {DATASET_SAMPLE_RATE}.')

        return events

    return mne.Epochs(
        raw=raw_data,
        events=get_events(),
        tmin=0.,
        tmax=MAX_TIME,
        preload=True,
        baseline=None,
        verbose=False)
