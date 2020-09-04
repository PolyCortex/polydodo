import os
import sys

# Ensure parent folder is in PYTHONPATH
module_path = os.path.abspath(os.path.join('..'))
if module_path not in sys.path:
    sys.path.append(module_path)

import matplotlib.pyplot as plt
import numpy as np
from copy import deepcopy

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import (GridSearchCV,
                                     RandomizedSearchCV)
from sklearn.metrics import (make_scorer,
                             cohen_kappa_score)

from constants import (SLEEP_STAGES_VALUES,
                       EPOCH_DURATION)

SUBJECT_COL_IDX = 0


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
    
def train_test_split_one_subject(X, y, subject_test=19):
    """Splits matrix X into two sets, where second set only contains one subject
    Input
    -------
    X: np.array matrix of shape (n_samples, n_features)
    y: np.array of shape (n_samples,)
    subject_test: fixed subject to be in the test set
    
    Returns
    _______
    X_test, X_train, y_test, y_train: np.array matrices,
        where X have shape (n_samples_in_set, n_features) and y have shape (n_samples_in_set,)
    """
    test_indexes = np.where(X[:,SUBJECT_COL_IDX] == subject_test)[0]
    train_indexes = list(set(range(X.shape[0])) - set(test_indexes))

    assert X.shape[0] == len(train_indexes)+len(test_indexes), "Total train and test sets must corresponds to all dataset"
    
    X_test = X[test_indexes,:]
    y_test = y[test_indexes]
    X_train = X[train_indexes,:]
    y_train = y[train_indexes]
    
    return X_test, X_train, y_test, y_train

def train_test_split_according_to_age(X, y, use_continuous_age, subjects_test=None):
    """Splits matrix X into two sets, where second set contains several subject
    Input
    -------
    X: np.array matrix of shape (n_samples, n_features)
    y: np.array of shape (n_samples,)
    subjects_test: list of subjects to be in the second set. 
        if `None`, one random subject is chosen from each age group.
    
    Returns
    _______
    X_test, X_train, y_test, y_train: np.array matrices,
        where X have shape (n_samples_in_set, n_features) and y have shape (n_samples_in_set,)
    """
    AGE_CATEGORY_COL_IDX = 3
    AGE_GROUPS = [
        [0,49],  # 39 recordings
        [50,59], # 41 recordings
        [60,84], # 41 recordings
        [85,110] # 32 recordings
    ]
    age_categories = np.unique(X[:, AGE_CATEGORY_COL_IDX])
    assert subjects_test is None or len(subjects_test) == len(age_categories), "If subjects are specified, they must be specified for all age groups"

    if subjects_test is None:
        unique_subject_with_age = np.array([
            (subject, X[observation_idx, AGE_CATEGORY_COL_IDX])
            for subject, observation_idx
            in zip(*np.unique(X[:,SUBJECT_COL_IDX], return_index=True))])

        if use_continuous_age:
            subjects_test = [
                np.random.choice(
                    unique_subject_with_age[
                        (unique_subject_with_age[:,1] >= age_range[0]) &
                        (unique_subject_with_age[:,1] <= age_range[1]), 0])
                for age_range in AGE_GROUPS
            ]
        else:
            subjects_test = [
                np.random.choice(
                    unique_subject_with_age[
                        unique_subject_with_age[:,1] == age, 0])
                for age in age_categories
            ]

    print("Selected subjects for the test set are: ", subjects_test)
    test_indexes = np.where(np.isin(X[:,SUBJECT_COL_IDX], subjects_test))[0]
    train_indexes = list(set(range(X.shape[0])) - set(test_indexes))

    assert X.shape[0] == len(train_indexes)+len(test_indexes), "Total train and test sets must corresponds to all dataset"
    
    X_test = X[test_indexes,:]
    y_test = y[test_indexes]
    X_train = X[train_indexes,:]
    y_train = y[train_indexes]
    
    return X_test, X_train, y_test, y_train

def print_hyperparam_tuning_results(search_cv_results):
    """Helper function to print CV results
    Input
    -------
    search_cv_results: dict that comes from the `cv_results_` of `BaseSearchCV`(either `GridSearchCV` or `RandomizedSearchCV`)
    """
    for idx, rank in sorted(enumerate(search_cv_results['rank_test_score']), key=lambda x: x[1]):
        current_param = search_cv_results['params'][idx]
        score_mean = search_cv_results['mean_test_score'][idx]
        score_uncertainty = search_cv_results['std_test_score'][idx]
        print(f"{rank}. Parameter {current_param} has a score of {score_mean:0.4f} ± {score_uncertainty:0.3f}")
        
def evaluate_hyperparams_grid(params, estimator, X, y, cv, use_randomized=False):
    """Evaluates params according to Cohen Kappa's agreeement.
    Input
    -------
    params: Dictionary with parameters names (str) as keys and lists of parameter settings to try as values, or a list of such dictionaries, in which case the grids spanned by each dictionary in the list are explored. This enables searching over any sequence of parameter settings.
    estimator: This is assumed to implement the scikit-learn estimator interface.
    cv: Determines the cross-validation splitting strategy. 
    X: np.array matrix of shape (n_samples, n_features)
    y: np.array of shape (n_samples,)
    use_randomized: bool that toggles between the use of `RandomizedSearchCV` or `GridSearchCV`
    """
    
    if use_randomized:
        search = RandomizedSearchCV(
            estimator=estimator,
            param_distributions=params,
            scoring=make_scorer(cohen_kappa_score),
            cv=cv,
            n_jobs=-1,
            verbose=1,
            random_state=42
        )

    else:
        search = GridSearchCV(
            estimator=estimator,
            param_grid=params,
            scoring=make_scorer(cohen_kappa_score),
            cv=cv,
            n_jobs=-1,
            verbose=1
        )

    search.fit(X[:,2:], y)
    print_hyperparam_tuning_results(search.cv_results_)
    
def get_pipeline(classifier, dimension_reduction=None, classifier_pipeline_key='classifier'):
    """Returns pipeline with 
    Input
    -------
    params: Dictionary with parameters names (str) as keys and lists of parameter settings to try as values, or a list of such dictionaries, in which case the grids spanned by each dictionary in the list are explored. This enables searching over any sequence of parameter settings.
    estimator: This is assumed to implement the scikit-learn estimator interface.
    cv: Determines the cross-validation splitting strategy. 
    X: np.array matrix of shape (n_samples, n_features)
    y: np.array of shape (n_samples,)
    use_randomized: bool that toggles between the use of `RandomizedSearchCV` or `GridSearchCV`
    """
    NB_CATEGORICAL_FEATURES = 2
    NB_FEATURES = 48
    
    standardization_transformer = ColumnTransformer([
        ('pass-through-categorical', 'passthrough', list(range(NB_CATEGORICAL_FEATURES))),
        ('scaling-continuous', StandardScaler(copy=False), list(range(NB_CATEGORICAL_FEATURES,NB_FEATURES)))
    ])
    
    if dimension_reduction is not None:
        return Pipeline([
            ('scaling', standardization_transformer),
            ('dimension_reduction', dimension_reduction),
            (classifier_pipeline_key, classifier)
        ])

    return Pipeline([
        ('scaling', standardization_transformer),
        (classifier_pipeline_key, classifier)
    ])
    
def print_results_cv(accuracies, macro_f1_scores, weighted_f1_scores, kappa_agreements):
    print(f"Mean accuracy          : {np.mean(accuracies):0.2f} ± {np.std(accuracies):0.3f}")
    print(f"Mean macro F1-score    : {np.mean(macro_f1_scores):0.2f} ± {np.std(macro_f1_scores):0.3f}")
    print(f"Mean weighted F1-score : {np.mean(weighted_f1_scores):0.2f} ± {np.std(weighted_f1_scores):0.3f}")
    print(f"Mean Kappa's agreement : {np.mean(kappa_agreements):0.2f} ± {np.std(kappa_agreements):0.3f}")
    
def print_results_cv_scores(scores):
    """Prints scores from `cross_validate` function.
    Input
    -------
    scores: dictionnary with all test's scores
    """
    print_results_cv(scores['test_accuracy'],
                     scores['test_f1-score-macro'],
                     scores['test_f1-score-weighted'],
                     scores['test_agreement'])
    