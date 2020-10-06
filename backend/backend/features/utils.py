import mne

from backend.features.constants import MAX_TIME


def drop_other_channels(raw_data, channel_to_keep):
    """
    returns: mne.Raw with the two EEG channels
    """
    raw_data.drop_channels(
        [ch for ch in raw_data.info['ch_names'] if ch != channel_to_keep])

    return raw_data


def crop_raw_data(
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
        tmax=min(out_of_bed_seconds, raw_data.times[-1])
    )

    return raw_data


def convert_to_epochs(raw_data):
    """
    returns: mne.Epochs
    """
    return mne.Epochs(
        raw=raw_data,
        tmin=0.,
        tmax=MAX_TIME,
        preload=True,
        baseline=None,
        verbose=False)
