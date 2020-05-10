import os
import sys

# Ensure parent folder is in PYTHONPATH
module_path = os.path.abspath(os.path.join('..'))
if module_path not in sys.path:
    sys.path.append(module_path)

import matplotlib.pyplot as plt
import numpy as np
from copy import deepcopy

from constants import (SLEEP_STAGES_VALUES, EPOCH_DURATION)

def print_hypnogram(hypnograms, labels, subject, night): 
    """Prints hypnogram from arrays of sleep stage labels
    Input
    -------
    hypnograms: List of arrays, where each array contains label for each epoch of the night
    labels: List of strings, with each name given to the corresponding hypnogram (i.e. "scored", "predicted").
    subject: The subject index 
    night: The recording's night of subject
    """
    assert len(hypnograms) == len(labels), "Must specify a label for each hypnogram."

    NB_SECONDS_IN_ONE_HOUR = 3600
    ORDERED_SLEEP_STAGES = ['W','REM','N1','N2','N3']
    
    def reorder_sleep_stages(y_hypno):
        # Tweak to make REM between N1 and W: Add 1 to all non-wake stages, and REM=1.
        y_hypno[y_hypno == SLEEP_STAGES_VALUES["REM"]] = -1    
        y_hypno[y_hypno == SLEEP_STAGES_VALUES["N3"]] = SLEEP_STAGES_VALUES["REM"]
        y_hypno[y_hypno == SLEEP_STAGES_VALUES["N2"]] = SLEEP_STAGES_VALUES["N3"]
        y_hypno[y_hypno == SLEEP_STAGES_VALUES["N1"]] = SLEEP_STAGES_VALUES["N2"]
        y_hypno[y_hypno == -1] = SLEEP_STAGES_VALUES["N1"]
        # -------------------------------- #
        return y_hypno
        
    for y, label in zip(hypnograms, labels):
        y_hypno = deepcopy(y)
        y_hypno = reorder_sleep_stages(y_hypno)
        y_hypno = np.array([(index*EPOCH_DURATION, stage) for index, stage in enumerate(y_hypno)])    

        plt.plot(
            [stage_with_time[0]/NB_SECONDS_IN_ONE_HOUR for stage_with_time in y_hypno],
            [stage_with_time[1] for stage_with_time in y_hypno], label=label)
    
    plt.xlabel("Time since bed time (hours)")
    plt.ylabel("Sleep stage")
    plt.yticks(range(len(ORDERED_SLEEP_STAGES)), ORDERED_SLEEP_STAGES)
    plt.legend()

    plt.title(f"Hypnogram of subject {subject}, night {night}")
    plt.grid(axis='y')
    plt.gca().invert_yaxis()
    plt.show()