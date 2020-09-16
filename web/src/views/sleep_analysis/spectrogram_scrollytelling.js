import React, { useState } from 'react';
import { HYPNOGRAM_KEY } from '../../d3/spectrogram/constants';
import D3ComponentScrollyTelling from '../../components/d3component_scrollytelling';
import createSpectrogram from '../../d3/spectrogram/spectrogram';

import { useCSVData } from '../../hooks/api_hooks';

import hypnogramDataSleepEDFPath from 'assets/data/hypnogram.csv';
import spectrogramData from 'assets/data/spectrograms.json';

const SpectrogramScrollyTelling = () => {
  const csvDataSleepEDF = useCSVData(hypnogramDataSleepEDFPath);
  const spectrogramWithHypnogramData = csvDataSleepEDF
    ? { ...spectrogramData, [HYPNOGRAM_KEY]: csvDataSleepEDF }
    : null;
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <D3ComponentScrollyTelling
      callback={createSpectrogram}
      data={spectrogramWithHypnogramData}
      isInitialized={isInitialized}
      setIsInitialized={setIsInitialized}
      useDiv
    />
  );
};

export default SpectrogramScrollyTelling;
