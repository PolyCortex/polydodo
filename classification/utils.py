import numpy as np
import pandas as pd
import mne
from mne.datasets.sleep_physionet._utils import _check_subjects, _fetch_one, _data_path

BASE_URL = 'https://physionet.org/physiobank/database/sleep-edfx/sleep-cassette/'
AGE_SLEEP_RECORDS = './data/SC-index.csv'

EVENT_ID = {
    'Sleep stage W': 0,
    'Sleep stage 1': 1,
    'Sleep stage 2': 2,
    'Sleep stage 3/4': 3,
    'Sleep stage R': 4,
    'Sleep stage ?': 5,
    'Movement time': 6
}

ANNOTATIONS_EVENT_ID = {
    'Sleep stage W': 0,
    'Sleep stage 1': 1,
    'Sleep stage 2': 2,
    'Sleep stage 3': 3,
    'Sleep stage 4': 3,
    'Sleep stage R': 4,
    'Sleep stage ?': 5,
    'Movement time': 6
}

THIRTY_MINS_IN_SECS = 1800
EPOCH_DURATION = 30. # in seconds

"""
Code extracted from `https://github.com/mne-tools/mne-python/blob/maint/0.19/mne/datasets/sleep_physionet/age.py`
to change subject range from 20 to 82, in order to have access to the full dataset. Previously to this customization,
a magic number was used and limited the api to get only 20 subjects.
"""
def fetch_data(subjects, recording=[1, 2], path=None, force_update=False,
               update_path=None, base_url=BASE_URL,
               verbose=None):  # noqa: D301
    """Get paths to local copies of PhysioNet Polysomnography dataset files.
    This will fetch data from the publicly available subjects from PhysioNet's
    study of age effects on sleep in healthy subjects [1]_[2]_. This
    corresponds to a subset of 20 subjects, 10 males and 10 females that were
    25-34 years old at the time of the recordings. There are two night
    recordings per subject except for subject 13 since the second record was
    lost.
    See more details in
    `physionet website <https://physionet.org/physiobank/database/sleep-edfx/sleep-cassette/>`_.
    Parameters
    ----------
    subjects : list of int
        The subjects to use. Can be in the range of 0-19 (inclusive).
    recording : list of int
        The night recording indices. Valid values are : [1], [2], or [1, 2].
    path : None | str
        Location of where to look for the PhysioNet data storing location.
        If None, the environment variable or config parameter
        ``MNE_DATASETS_PHYSIONET_SLEEP_PATH`` is used. If it doesn't exist, the
        "~/mne_data" directory is used. If the Polysomnography dataset
        is not found under the given path, the data
        will be automatically downloaded to the specified folder.
    force_update : bool
        Force update of the dataset even if a local copy exists.
    update_path : bool | None
        If True, set the MNE_DATASETS_EEGBCI_PATH in mne-python
        config to the given path. If None, the user is prompted.
    %(verbose)s
    Returns
    -------
    paths : list
        List of local data paths of the given type.
    """
    records = np.loadtxt(AGE_SLEEP_RECORDS,
                         skiprows=1,
                         delimiter=',',
                         dtype={'names': ('subject', 'record', 'type', 'sha',
                                          'fname'),
                                'formats': ('<i2', 'i1', '<S9', 'S40', '<S22')}
                         )
    psg_records = records[np.where(records['type'] == b'PSG')]
    hyp_records = records[np.where(records['type'] == b'Hypnogram')]

    path = _data_path(path=path, update_path=update_path)
    params = [path, force_update, base_url]

    _check_subjects(subjects, 83)

    fnames = []
    for subject in subjects:
        for idx in np.where(psg_records['subject'] == subject)[0]:
            if psg_records['record'][idx] in recording:
                psg_fname = _fetch_one(psg_records['fname'][idx].decode(),
                                       psg_records['sha'][idx].decode(),
                                       *params)
                hyp_fname = _fetch_one(hyp_records['fname'][idx].decode(),
                                       hyp_records['sha'][idx].decode(),
                                       *params)
                fnames.append([psg_fname, hyp_fname])

    return fnames


def get_epochs(files, subject_files, df_subject_information, max_time, cropping=True, equalize_event_counts=False):

    all_subject_epochs = []
    print("Creating epochs for files : ", files)
    for i in files:
        # 1. get all epochs of one person
        raw_data = mne.io.read_raw_edf(subject_files[i][0], preload=False, verbose=False, exclude=["Temp rectal", "Event marker", "Resp oro-nasal", "EMG submental", "EOG horizontal"])
        # 2. add the sleep stage annotation to the raw data
        annotations = mne.read_annotations(subject_files[i][1])
        raw_data.set_annotations(annotations, emit_warning=False)
        # 3. We crop everything before lights off and 30 minutes after getting up of bed
        if cropping:
            lights_off = df_subject_information.loc[i, 'LightsOffSecond']
            night_duration = df_subject_information.loc[i, 'NightDuration']
            woke_up_time = lights_off + night_duration
            raw_data.crop(tmin=lights_off, tmax=min(woke_up_time + THIRTY_MINS_IN_SECS, raw_data.times[-1]))

        # 4. transform into epochs
        events, annot_event_id = mne.events_from_annotations(raw_data, event_id=ANNOTATIONS_EVENT_ID.copy(), chunk_duration=EPOCH_DURATION, verbose=False)

        # 5. Few files do not have N3 sleep (i.e. SC4202EC-Hypnogram), so we have to filter out key-value pairs that are not in the annotations.
        event_ids = {
            event_key: EVENT_ID[event_key]
            for event_key in EVENT_ID
            if EVENT_ID[event_key] in annot_event_id.values()
        }

        try:
            epochs = mne.Epochs(raw=raw_data, events=events, event_id=event_ids, tmin=0., tmax=max_time, baseline=None, verbose=False)
        except ValueError as e:
            # If no ? epochs are created, we need to ignore this class
            event_ids.pop('Sleep stage ?', None)
            epochs = mne.Epochs(raw=raw_data, events=events, event_id=event_ids, tmin=0., tmax=max_time, baseline=None, verbose=False)

        if equalize_event_counts:
            epochs.equalize_event_counts(event_ids.keys())

        all_subject_epochs.append(epochs)

    print("Concatenating all epochs together...")
    return mne.concatenate_epochs(all_subject_epochs)