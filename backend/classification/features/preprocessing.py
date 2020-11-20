import logging
import mne
from scipy.signal import cheby1

from classification.config.constants import (
    EPOCH_DURATION,
)
from classification.features.constants import (
    DATASET_SAMPLE_RATE,
    DATASET_HIGH_PASS_FREQ,
    HIGH_PASS_FILTER_ORDER,
    HIGH_PASS_MAX_RIPPLE_DB,
)

_logger = logging.getLogger(__name__)


def preprocess(classification_request):
    """Returns preprocessed epochs of the specified channel
    Input
    -------
    classification_request: instance of ClassificationRequest
    """
    raw_data = classification_request.raw_eeg.copy()

    _logger.info("Cropping data from bed time to out of bed time.")
    raw_data = _crop_raw_data(
        raw_data,
        classification_request.in_bed_seconds,
        classification_request.out_of_bed_seconds,
    )

    _logger.info(f"Applying high pass filter at {DATASET_HIGH_PASS_FREQ}Hz.")
    raw_data = _apply_high_pass_filter(raw_data)

    _logger.info(f"Resampling data at the dataset's sampling rate of {DATASET_SAMPLE_RATE} Hz.")
    raw_data = raw_data.resample(DATASET_SAMPLE_RATE)

    _logger.info(f"Epoching data with a {EPOCH_DURATION} seconds duration.")
    raw_data = _convert_to_epochs(raw_data)

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
    sampling_rate = raw_data.info['sfreq']
    b, a = cheby1(
        HIGH_PASS_FILTER_ORDER,
        HIGH_PASS_MAX_RIPPLE_DB,
        DATASET_HIGH_PASS_FREQ,
        fs=sampling_rate,
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
