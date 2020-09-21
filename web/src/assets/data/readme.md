# Sleep Data

This folder holds all static data needed for our visualisations. This data is used in the `Analyze my sleep` page (as the preview example) and in the `Performance` page.

## OpenBCI Data

In order to demonstrate the use of data from the OpenBCI to classify sleep stages, we will use the night of William, predicted by our classifier, as the preview. The spectrogram data is also from the data acquired with the OpenBCI.

We also have the manually labelled hypnogram of William's night, which will be used to illustrate our classifier performances.

The files used are:

- `hypnogram-openbci-predicted.csv`

  Predicted hypnogram of William's night

- `hypnogram-openbci-electrophysiologist.csv`

  Manually labelled hypnogram of William's night

- `spectrograms-openbci-predicted.json`

  Frequencies and power spectrum densities calculated from William's EEG data

## OpenBCI Data

In order to illustrate the bias occured when manually scoring a night of sleep, we have data which allows us to compare two scorers' agreement. The manuel on which both scored is not the same.

The files used are:

- `hypnogram-labelled.csv`

  Manually labelled hypnogram of a subject's night by a scorer which participated in making the dataset.

- `hypnogram-electrophysiologist.csv`

  Manually labelled hypnogram of a subject's night by an electrophysiologist which we contacted.

- `hypnogram-predicted.csv`

  Predicted hypnogram of a subject's night by our classifier
