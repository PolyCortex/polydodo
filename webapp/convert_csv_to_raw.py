import numpy as np
import scipy
from scipy import signal
from scipy.interpolate import griddata
import copy
import pandas as pd
import math
import mne

def convert_csv_to_raw(path_csv):
    ## UPSAMPLING
    #Low-sampling-rate data to upsample
    #Original sampling rate
    str_srate = pd.read_csv(path_csv, header= None, usecols = [0], skiprows = 2, nrows=1)
    ori_srate = pd.DataFrame.to_string(str_srate)
    ori_srate = [float(s) for s in ori_srate.split() if s.replace('.','',1).isdigit()]
    s_rate = ori_srate[-1]
    #signal
    signal_bci = pd.read_csv(path_csv, header = None, usecols = [1,2],skiprows=7) 
    signal_bci = np.array(signal_bci)
    channel_1 = signal_bci[:,0]
    channel_2 = signal_bci[:,1]
    npts1 = len(channel_1) #equal to len(channel_2) also
    time  = np.arange(0,npts1)/s_rate

    #Upsample by a factor
    upsampleFactor = 2
    newNpts = npts1 * upsampleFactor

    #New time vector after upsampling
    newUpTime = np.arange(0,newNpts)/(upsampleFactor*s_rate)
    newUpTime = newUpTime[newUpTime<time[-1]]

    #Interpolate using griddata
    upSignal_1 = griddata(time, channel_1, newUpTime, method='linear')
    upSignal_2 = griddata(time, channel_2, newUpTime, method='linear')

    ##DOWNSAMPLING
    up_srate = 500
    downsampleFactor = 5
    newDsrate = up_srate/downsampleFactor
    newNptsDs = newNpts / downsampleFactor

    # new time vector after downsampling
    newDsTime = np.arange(0,newNptsDs)/newDsrate

    #Filtering at new Nyquist
    newNyquist = newDsrate/2
    fkern = signal.firwin(int(14*newNyquist),newNyquist,fs=up_srate,pass_zero=True)
    fil_Up1 = signal.filtfilt(fkern,1,tuple(upSignal_1),axis=0)
    fil_Up2 = signal.filtfilt(fkern,1,tuple(upSignal_2),axis=0)

    #Downsampling
    signal_Ds_1 = fil_Up1[:-1:downsampleFactor]
    signal_Ds_2 = fil_Up2[:-1:downsampleFactor]

    ##Converting to MNE raw object
    srate = 100
    data = np.array([signal_Ds_1, signal_Ds_2])

    # Definition of channel types and names.
    ch_types = ['eeg', 'eeg']
    ch_names = ['N1P', 'N2P']

    #Create MNE info object
    info = mne.create_info(ch_names=ch_names, sfreq=srate, ch_types=ch_types)

    #Create dummy MNE rawArray object
    raw = mne.io.RawArray(data, info)



convert_csv_to_raw(r"C:\Users\thier\Documents\PolyCortex\Sommeil\Preprocessing\Nuit_Will.csv")



