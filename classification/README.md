# Sleep Stage Classification
___

This project aims to classify a full night of sleep based on two-channels of raw EEG signal. The sleep stage annotations should follow those of the *American Academy of Sleep Medicine (AASM) scoring manual* [[1]](https://aasm.org/clinical-resources/scoring-manual/).

A particularity of this project is that the data on which we will later apply our classifier will be different from the data from which we've trained on. Indeed, since there's no large public dataset of sleep stage classification based on the hardware we use and recommend (because of its affordability), we need to train on a dataset that used different recording equipment. Thus, our pipeline should also be able to classify sleep based on EEG acquired by different types of hardware (i.e. OpenBCI).

## Project Summary
___

Once the right dataset was chosen, the following steps were taken in order to successfully classify sleep stages:
1) Dataset exploration
2) Feature extraction
3) Model exploration
4) Testing on Open BCI data
5) Feature and annotation formatting to csv

## Dataset & Exploration
___

We will cover the choices that led us to Sleep-EDF as our main dataset, a brief overview and exploration results.

### Dataset Choice: Sleep-EDF Expanded
___

The dataset we chose needed to be easily accessible and generally used within the community, so that we could easily compare with literature. We initially considered using the Sleep-EDF Expanded [[2]](https://physionet.org/content/sleep-edfx/1.0.0/), the Montreal archive of sleep studies [[3]]() and the Sleep Heart Health Study collection [[4]](). Although the former has the least number of recordings, we only kept this one, because it is accessible online, and doesn't require any form or ethical committee submission. Also, the dataset is quite homogenious, whereas all recordings follow the same format and montage. It then requires less data preprocessing. It also contains enough recordings to train our classifiers. Indeed, we can see that, although there are not many recordings in Sleep EDF Expanded compared to the others, each one of the recording lasts about 20 hours (8 hours asleep). It is then possible to even apply deep sleep algorithm on that dataset, so that it wouldn't be a limitation when we will explore different kinds of models. Finally, , as stated here [[4]](fiorillo et al. 2019)., Sleep-EDF Expanded, along with Sleep-EDF, are the most commonly used datasets to test sleep stage classification algorithm.

On the other hand, for the next iterations of improving our classifier, the use of other dataset could be useful to train on certain age groups not captured by Sleep-EDF Expanded, or subjects with various sleep pathologies.

### Overview
___

### Exploration results
___

## Feature Extraction
___

## Explored Classifiers
___


## Postprocessing
___

## Results
___


See: https://www.kaggle.com/WinningModelDocumentationGuidelines