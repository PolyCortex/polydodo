import numpy as np
import scipy
from scipy import signal
from scipy.interpolate import griddata
import copy
import pandas as pd
import math
import mne
from fractions import Fraction
import pandas_schema
from pandas_schema import Column
from pandas_schema.validation import CustomElementValidation
from decimal import *

SAMPLING_RATE = 100

def check_decimal(dec):
    try:
        Decimal(dec)
    except InvalidOperation: 
        return False
    return True

""" def do_validation(data):
    # define validation elements
    decimal_validation = [CustomElementValidation(lambda d: check_decimal(d), 'is not decimal')]
    null_validation = [CustomElementValidation(lambda d: d is not np.nan, 'this field cannot be null')]

    # define validation schema
    schema = pandas_schema.Schema([
            Column('dec1', decimal_validation + null_validation),
            Column('dec2', decimal_validation+ null_validation)), """

def upsampling(ch_1, ch_2, up_factor, starting_s_rate):
    npts = len(ch_1) #equal to len(ch_2) also
    time  = np.arange(0,npts)/starting_s_rate

    #Upsample by a factor
    new_npts = npts * up_factor

    #New time vector after upsampling
    new_up_time = np.arange(0,new_npts)/(up_factor*starting_s_rate)
    new_up_time = new_up_time[new_up_time<time[-1]]

    #Interpolate using griddata
    up_signal_1 = griddata(time, ch_1, new_up_time, method='linear')
    up_signal_2 = griddata(time, ch_2, new_up_time, method='linear')
    
    return [up_signal_1, up_signal_2]

def downsampling(ch_1, ch_2, down_factor, starting_s_rate):
    npts = len(ch_1) #equal to len(ch_2) also
    new_ds_rate = starting_s_rate/down_factor
    new_npts = npts / down_factor

    #Filtering at new Nyquist
    new_nyquist = new_ds_rate/2
    fkern = signal.firwin(int(14*new_nyquist),new_nyquist,fs=starting_s_rate,pass_zero=True)
    filt_up_1 = signal.filtfilt(fkern,1,tuple(ch_1),axis=0)
    filt_up_2 = signal.filtfilt(fkern,1,tuple(ch_2),axis=0)

    #Downsampling
    signal_ds_1 = filt_up_1[:-1:down_factor]
    signal_ds_2 = filt_up_2[:-1:down_factor]

    return [signal_ds_1, signal_ds_2]

def convert_to_raw(ch_1, ch_2):
    data = np.array([ch_1, ch_2])
    # Definition of channel types and names for MNE raw object
    ch_types = ['eeg', 'eeg']
    ch_names = ['N1P', 'N2P']
    #Create MNE info object
    info = mne.create_info(ch_names=ch_names, sfreq=SAMPLING_RATE, ch_types=ch_types)
    #Create dummy MNE rawArray object
    raw = mne.io.RawArray(data, info)

    return raw


#board defines which board was used for the acquisition of EEG data
#this value is obtained from the form the user has to fill out before
#uploading his data. 0 = Ganglion and 1 = Cyton
def convert_csv_to_raw(path_csv, board): 
    #Reading the original sampling rate : s_rate
    str_srate = pd.read_csv(path_csv, header= None, usecols = [0], skiprows = 2, nrows=1)
    ori_srate = pd.DataFrame.to_string(str_srate)
    ori_srate = [float(s) for s in ori_srate.split() if s.replace('.','',1).isdigit()]
    s_rate = int(ori_srate[-1])

    if board == 0:
        n_rows_to_skip = 7
    elif board == 1:
        n_rows_to_skip = 6
    
    #Reading the original signal
    signal_bci = pd.read_csv(path_csv, header = None, usecols = [1,2],skiprows=n_rows_to_skip) 
    signal_bci = np.array(signal_bci)
    channel_1 = signal_bci[:,0]
    channel_2 = signal_bci[:,1]

    #Getting factors for upsampling and downsampling
    frac = Fraction(SAMPLING_RATE, s_rate)
    up_sampling_factor = frac.numerator
    down_sampling_factor = frac.denominator

    if up_sampling_factor == 1 and down_sampling_factor == 1: #Only conversion to raw object
        raw = convert_to_raw(channel_1, channel_2)

    elif up_sampling_factor == 1 and down_sampling_factor != 1: #Downsampling and conversion to raw
        [ds_channel_1, ds_channel_2] = downsampling(channel_1, channel_2, down_sampling_factor, s_rate)
        raw = convert_to_raw(ds_channel_1,ds_channel_2)   
        
    elif down_sampling_factor == 1 and up_sampling_factor != 1: #Upsampling and conversion to raw
        [up_channel_1, up_channel_2] = upsampling(channel_1, channel_2, up_sampling_factor, s_rate)
        raw = convert_to_raw(up_channel_1, up_channel_2)

    else : #Upsampling then downsampling and conversion to raw
        [up_channel_1, up_channel_2] = upsampling(channel_1, channel_2, up_sampling_factor, s_rate)
        new_sampling_rate = s_rate*up_sampling_factor
        [ds_channel_1, ds_channel_2] = downsampling(up_channel_1, up_channel_2, down_sampling_factor, new_sampling_rate)
        raw = convert_to_raw(ds_channel_1, ds_channel_2)

    return raw




