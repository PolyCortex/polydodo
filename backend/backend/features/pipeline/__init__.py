from sklearn.pipeline import FeatureUnion


feature_union = FeatureUnion([
    ('time_domain', time_domain_pipeline),
    ('frequency_domain', frequency_domain_pipeline),
    ('subband_time_domain', subband_feature_union)
], n_jobs=1)
