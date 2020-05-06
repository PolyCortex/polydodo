from collections import OrderedDict
import random
import numpy as np
import os

"""
This is a simplified and modified version of the data loader from the deepsleepnet repo:
https://github.com/akaraspt/deepsleepnet/blob/master/deepsleep/data_loader.py
"""

class DataLoader(object):
    
    def __init__(self, data_dir):
        self.data_dir = data_dir

    def _load_npz_file(self, npz_file):
        """Load data and labels from a npz file."""
        with np.load(npz_file) as f:
            data = f["x"]
            labels = f["y"]
            sampling_rate = f["fs"]
        return data, labels, sampling_rate

    def _load_npz_list_files(self, npz_files, verbose=0):
        """Load data and labels from list of npz files."""
        data = {}
        labels = {}
        fs = None
        for npz_f in npz_files:
            if verbose:
                print("Loading {} ...".format(npz_f))
            tmp_data, tmp_labels, sampling_rate = self._load_npz_file(npz_f)
            if fs is None:
                fs = sampling_rate
            elif fs != sampling_rate:
                raise Exception("Found mismatch in sampling rate.")
            
            ch_subject = npz_f.replace('data/', '').replace('.npz', '')
            data[ch_subject] = tmp_data
            
            # extract subject id
            subject = npz_f.split('/')[-1].replace('.npz', '')
            labels[subject] = tmp_labels
            
        return data, labels

    def load_data(self, n_files=None, verbose=0):
        """Return data and labels in OrderedDict (keys - filenames)."""
        
        allfiles = os.listdir(self.data_dir)
        
        npzfiles = []
        for idx, f in enumerate(allfiles):
            if ".npz" in f:
                npzfiles.append(os.path.join(self.data_dir, f))
        npzfiles.sort()

        if n_files is not None:
            npzfiles = npzfiles[:n_files]
        
        npzfiles.sort()    
        data, labels = self._load_npz_list_files(npzfiles, verbose=verbose)
    
        data = OrderedDict(sorted(data.items()))
        labels = OrderedDict(sorted(labels.items()))
        
        return data, labels