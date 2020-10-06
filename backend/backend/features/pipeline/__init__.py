from sklearn.pipeline import FeatureUnion

from backend.features.pipeline.time_domain_transformers import (
    get_time_domain_pipeline
)
from backend.features.pipeline.frequency_domain_transformers import (
    get_frequency_domain_pipeline
)
from backend.features.pipeline.subband_transformers import (
    get_subband_feature_union
)


def get_feature_union():
    return FeatureUnion([
        ('time_domain', get_time_domain_pipeline()),
        ('frequency_domain', get_frequency_domain_pipeline()),
        ('subband_time_domain', get_subband_feature_union())
    ], n_jobs=1)
