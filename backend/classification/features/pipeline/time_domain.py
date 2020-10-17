import numpy as np
from scipy.stats import (skew, kurtosis)
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.preprocessing import (FunctionTransformer)


from classification.features.pipeline.utils import (
    get_transformer,
    get_transformer_list,
    get_data_from_epochs,
)


def get_zero_crossing_rate(signal):
    """
    Multiplies signal by itself shifted by one.
    If the signal crosses the horizontal axis,
    the sign will be negative and vice-versa.

    Returns nb of time the signal crossed the horizontal axis
    """
    return ((signal[:-1] * signal[1:]) < 0).sum()


def get_mean_crossing_rate(signal):
    return get_zero_crossing_rate(signal - np.mean(signal))


def hjorth(X):
    """ Compute Hjorth mobility and complexity of a time series from either two
    [source: https://github.com/forrestbao/pyeeg]
    cases below:
        1. X, the time series of type list (default)
        2. D, a first order differential sequence of X (if D is provided,
           recommended to speed up)
    In case 1, D is computed using Numpy's Difference function.
    Notes
    -----
    To speed up, it is recommended to compute D before calling this function
    because D may also be used by other functions whereas computing it here
    again will slow down.
    Parameters
    ----------
    X
        list
        a time series
    D
        list
        first order differential sequence of a time series
    Returns
    -------
    As indicated in return line (mobility, complexity)
    """
    D = np.diff(X)
    D = D.tolist()

    D.insert(0, X[0])  # pad the first difference
    D = np.array(D)

    n = len(X)

    M2 = float(sum(D ** 2)) / n
    TP = sum(np.array(X) ** 2)
    M4 = 0
    for i in range(1, len(D)):
        M4 += (D[i] - D[i - 1]) ** 2
    M4 = M4 / n

    # Hjorth Mobility and Complexity
    mobility = np.sqrt(M2 / TP)
    complexity = np.sqrt(
        float(M4) * TP / M2 / M2
    )
    return [mobility, complexity]


def get_time_domain_pipeline():
    get_data_from_epochs_transformer = FunctionTransformer(
        get_data_from_epochs, validate=False)
    mean_transformer = FunctionTransformer(
        get_transformer(np.mean), validate=True)
    std_transformer = FunctionTransformer(
        get_transformer(np.std), validate=True)
    skew_transformer = FunctionTransformer(
        get_transformer(skew), validate=True)
    kurtosis_transformer = FunctionTransformer(
        get_transformer(kurtosis), validate=True)
    mean_crossing_rate_transformer = FunctionTransformer(
        get_transformer(get_mean_crossing_rate), validate=True)
    hjorth_transformer = FunctionTransformer(
        get_transformer_list(hjorth), validate=True)

    return Pipeline([
        ('epochs_to_data', get_data_from_epochs_transformer),
        ('time_domain_features', FeatureUnion([
            ('mean', mean_transformer),
            ('std', std_transformer),
            ('skew', skew_transformer),
            ('kurtosis', kurtosis_transformer),
            ('mean-crossing-rate', mean_crossing_rate_transformer),
            ('hjorth', hjorth_transformer)
        ], n_jobs=1))
    ])
