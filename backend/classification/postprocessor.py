from hmmlearn.hmm import MultinomialHMM

from classification.config.constants import (
    HiddenMarkovModelProbability,
    N_STAGES,
)


def get_hmm_model(state):
    """Creates an instance of MultinomialHMM, which follows sklearn interface
    Input:
    - state: dictionnary
        where the keys are HiddenMarkovModelProbability choices
        where the values are the probabilities matrices or arrays which
        describes the according hidden markov model state
    Returns: an instance of a trained MultinomialHMM
    """
    hmm_model = MultinomialHMM(n_components=N_STAGES)

    hmm_model.emissionprob_ = state[HiddenMarkovModelProbability.emission.name]
    hmm_model.startprob_ = state[HiddenMarkovModelProbability.start.name]
    hmm_model.transmat_ = state[HiddenMarkovModelProbability.transition.name]

    return hmm_model
