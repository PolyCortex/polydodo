from itertools import chain

from mne.time_frequency import psd_welch
import numpy as np

from classification.features.constants import FREQ_BANDS_RANGE
from classification.config.constants import EEG_CHANNELS


class SpectrogramGenerator():
    def __init__(self, epochs):
        self.epochs = epochs

        range_frequencies = set(chain(*FREQ_BANDS_RANGE.values()))
        self.spectrogram_min_freq = min(range_frequencies)
        self.spectrogram_max_freq = max(range_frequencies)

    def generate(self):
        psds, freqs = psd_welch(
            self.epochs,
            fmin=self.spectrogram_min_freq,
            fmax=self.spectrogram_max_freq,
            verbose=False,
        )
        psds_db = self._convert_amplitudes_to_decibel(psds)

        spectrogram = {'frequencies': freqs.tolist()}

        for index, eeg_channel in enumerate(EEG_CHANNELS):
            spectrogram[eeg_channel.lower()] = psds_db[:, index, :].tolist()

        return spectrogram

    def _convert_amplitudes_to_decibel(self, amplitudes):
        return 10 * np.log10(np.maximum(amplitudes, np.finfo(float).tiny))
