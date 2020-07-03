# Sleep Stage Classification

This project aims to classify a full night of sleep based on two-channels of raw EEG signal. The sleep stage annotations should follow those of the *American Academy of Sleep Medicine (AASM) scoring manual* [[1]](https://aasm.org/clinical-resources/scoring-manual/).

A particularity of this project is that the data on which we will later apply our classifier will be different from the data from which we've trained on. Indeed, since there's no large public dataset of sleep stage classification based on the hardware we use and recommend (because of its affordability), we need to train on a dataset that used different recording equipment. Thus, our pipeline should also be able to classify sleep based on EEG acquired by different types of hardware (i.e. OpenBCI).

## Project Summary

Once the right dataset was chosen, the following steps were taken in order to successfully classify sleep stages:
1) Dataset exploration
2) Feature extraction
3) Model exploration
4) Testing on Open BCI data
5) Feature and annotation formatting to csv

## How to Recreate Results

The order in which the notebooks should be run is the following:

1) `exploration/subject_exploration.ipynb`: This notebook will generate the recording's info file, namely `recordings-info.csv`, which holds the extrapolated onset time at which the user closed the lights. It also holds the total night duration. Those information will be used to crop the recordings to only keep epochs of the subject's night.
2) `feature_extraction.ipynb`: This notebook takes the recordings file and extract the different features. It will save two files, one that holds the features (`x_features.npy`) and the other which holds the sleep stage labels (`y_observations.npy`). If you also want to test the OpenBCI performance, it extracts the feature from the OpenBCI recordings into the `X_openbci_HP.npy` and scored labels into `y_openbci_HP.npy`.
3) `models/{RF_HMM, KNN, NB, SVC, voting_clf}.ipynb`: These notebooks train the corresponding classifier with the previously extracted features. Each notebook also saves the trained classifier into the `trained_models` folder. Also, in order to have the hidden markov model matrices for the postprecessing step, you must run the final steps of `models/RF_HMM.ipynb`. 
4) `data_generation.ipynb`: This notebook allows the formatting of the data so that it can be used by the front end.
5) `prediction_{openbci, anonymous}.ipynb`: These notebooks allows you to check the accuracy of a trained classifier on a single night recording.

## Dataset & Exploration

We will cover the choices that led us to Sleep-EDF as our main dataset, a brief overview and exploration results.

### Dataset Choice: Sleep-EDF Expanded

The dataset we chose needed to be easily accessible and generally used within the community, so that we could easily compare with literature. We initially considered using the Sleep-EDF Expanded [[2]](https://physionet.org/content/sleep-edfx/1.0.0/), the Montreal archive of sleep studies [[3]]() and the Sleep Heart Health Study collection [[4]](). Although the former has the least number of recordings, we only kept this one, because it is accessible online, and doesn't require filling any form or ethical committee submission. Also, the dataset is quite homogenious, whereas all recordings follow the same format and montage. It then requires less data preprocessing. It also contains enough recordings to train our classifiers. Indeed, we can see that, although there are not many recordings in Sleep EDF Expanded compared to the others, each one of the recording lasts about 20 hours (8 hours asleep). It is then possible to even apply deep sleep algorithm on that dataset, so that it wouldn't be a limitation when we will explore different kinds of models. Finally, , as stated here [[4]](fiorillo et al. 2019)., Sleep-EDF Expanded, along with Sleep-EDF, are the most commonly used datasets to test sleep stage classification algorithm.

On the other hand, for the next iterations of improving our classifier, the use of other dataset could be useful to train on certain age groups not captured by Sleep-EDF Expanded, or subjects with various sleep pathologies.

### Overview

<!-- Short desciption of the chosen dataset (context what/when/how/why), how it compares to the data we will afterwards collect (scoring manual, recording equipment, signal preprocessing) -->

Sleep-EDF extended is a dataset that is separated in two sections: sleep cassette (SC) and sleep telemetry (ST). They were compiled for two different research; the further was intended to study the impact of age and sex over sleep, and the latter was intended to study the effect of Temazepan on sleep. We only used the SC part of the dataset, because we initially only wanted to train on subjects that didn't have sleep pathologies.

As stated on the Physionet website, resource group managed by the National Institutes of Health (NIH), the SC part of the dataset can be described as:
> The 153 SC* files (SC = Sleep Cassette) were obtained in a 1987-1991 study of age effects on sleep in healthy Caucasians aged 25-101, without any sleep-related medication [2]. Two PSGs of about 20 hours each were recorded during two subsequent day-night periods at the subjects homes. Subjects continued their normal activities but wore a modified Walkman-like cassette-tape recorder described in chapter VI.4 (page 92) of Bob’s 1987 thesis [7]. [...]

Overall, there are 82 subjects whom participated in this research. The following signals have been recorded:
| Label          | Sample Frequency | Physical Range | Unit | Digital Range | High Pass           | Low Pass |
|----------------|------------------|----------------|------|---------------|---------------------|----------|
| EEG Fpz-Cz     | 100 Hz           | [-192,+192]    | uV   | [-2048,+2047] | 0.5 Hz              | -        |
| EEG Pz-Oz      | 100 Hz           | [-197,+196]    | uV   | [-2048,+2047] | 0.5 Hz              | -        |
| EOG Horizontal | 100 Hz           | [-1009,+1009]  | uV   | [-2048,+2047] | 0.5 Hz              | -        |
| Resp oro-nasal | 1 Hz             | [-2048,+2047]  |      | [-2048,+2047] | 0.03 Hz             | 0.9 Hz   |
| EMG Sumbental  | 1 Hz             | [-5,+5]        | uV   | [-2500,+2500] | 16 Hz Rectification | 0.7 Hz   |
| Temp Rectal    | 1 Hz             | [+34,+40]      | °C   | [-2849,+2731] | -                   | -        |

> The EOG and EEG signals were each sampled at 100 Hz. The submental-EMG signal was electronically highpass filtered, rectified and low-pass filtered after which the resulting EMG envelope expressed in uV rms (root-mean-square) was sampled at 1Hz. Oro-nasal airflow, rectal body temperature and the event marker were also sampled at 1Hz.

### Exploration results

<!-- find features that discriminates sleep stages the most -->

We first explored the dataset in order to find the features that will help discriminate sleep stages. In order to accomplish this, we've divided in exploration into two categories: exploration through the categorical features that came with the dataset (see `exploration/subject_exploration.ipynb`), and exploration through the two EEG signal (see `exploration/exploration.ipynb`).

Firstly, a description of the subjects that participated in the recording of the dataset includes their age, their sex and the time at which they closed the lights. In order to analyze the impact of the different characteristics on sleep, we extrapolated the total time spent alseep, the total time spent in every sleep stage and the hour at which the subject went to sleep.

Secondly, we explored different features that can be computed from each epoch in order to see which features allows to discriminate sleep stages. Based on different papers, we explored time domain features, frequency domain features and time domain features after applying subband filters.

<!-- Talk more on the results of that exploration -->

## Feature Extraction

<!-- how we've managed to extract features effectively, given restrictions on memory (and time) -->

## Explored Classifiers

We've mostly tested on classical statistical models, and only tried one deep learning models. Having completed the fastidious work of extracting significant features from our signals, representational learning, with CNN, did not give us as good results as we had with our extracted features. Furthermore, the simpler models can be trained much faster, and gave us results that we could more easily interpret.

## Postprocessing

## Results


See: https://www.kaggle.com/WinningModelDocumentationGuidelines
