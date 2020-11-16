"""
Function utilities to convert data acquired on an OpenBCI board

TODO: Consider cropping file (from bed to wake up time) here, before the for loop. Have to consider
not all lines hold sample values (i.e. first line with comment and second line with a single timestamp).

The file conversion is based off the code written to convert
the raw hexadecimal data to signed decimal values in the OpenBCI GUI:
[https://github.com/OpenBCI/OpenBCI_GUI/blob/f907e6a23e4fe640179ff8421044c641d45f2c12/OpenBCI_GUI/DataLogging.pde#L1554-L1595]
The Cyton board logging format is also described here:
[https://docs.openbci.com/docs/02Cyton/CytonSDCard#data-logging-format]
"""
import logging

from mne import create_info
from mne.io import RawArray

from classification.config.constants import EEG_CHANNELS
from classification.parser.file_type import detect_file_type
from classification.parser.sample_rate import detect_sample_rate


_logger = logging.getLogger(__name__)


def get_raw_array(file):
    """Converts a file following a logging format into a mne.RawArray
    Input:
    - file: received as an input file
    Returns:
    - mne.RawArray of the two EEG channels of interest
    """

    filetype = detect_file_type(file)

    sample_rate = detect_sample_rate(file, filetype)

    _logger.info(
        f"EEG data has been detected to be in the {filetype.name} format "
        f"and has a {sample_rate}Hz sample rate"
    )

    eeg_raw = filetype.parser(file)

    raw_object = RawArray(
        eeg_raw,
        info=create_info(
            ch_names=EEG_CHANNELS,
            sfreq=sample_rate,
            ch_types='eeg'),
        verbose=False,
    )

    _logger.info(
        f"Finished converting EEG file to mne.RawArray object "
        f"with the first sample being {raw_object[:, 0]}, "
        f"with {raw_object.n_times} samples, "
        f"with a {raw_object.n_times / (3600 * sample_rate):.2f} hours duration and "
        f"with channels named {raw_object.ch_names}."
    )

    return raw_object
