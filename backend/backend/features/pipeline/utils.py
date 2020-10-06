def get_data_from_epochs(epochs):
    """
    epochs: mne.Epochs

    returns np array of shape (nb_epochs, sampling_rate*epoch_length)
    """
    return epochs.get_data().squeeze()


def get_transformer(get_feature):

    def get_one_feature_per_epoch(X, get_feature):
        """
        X: Input matrix (nb_epochs, sampling_rate*epoch_length)
        get_feature: callable
            generates one feature for each epoch

        returns matrix (nb_epoch,1)
        """
        return [[get_feature(epoch)] for epoch in X]

    return lambda X: get_one_feature_per_epoch(X, get_feature)


def get_transformer_list(get_features):

    def get_feature_list_per_epoch(X, get_features):
        """
        X: Input matrix (nb_epochs, sampling_rate*epoch_length)
        get_feature: callable
            generates a list of features for each epoch

        returns matrix (nb_epoch,nb_features)
        """
        return [get_features(epoch) for epoch in X]

    return lambda X: get_feature_list_per_epoch(X, get_features)
