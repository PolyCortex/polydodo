from hmmlearn.hmm import MultinomialHMM

from classification.config.constants import (
    HiddenMarkovModelProbability,
    N_STAGES,
)


def postprocess(predictions, postprocessing_state):
    hmm_model = MultinomialHMM(n_components=N_STAGES)

    hmm_model.emissionprob_ = postprocessing_state[HiddenMarkovModelProbability.emission.name]
    hmm_model.startprob_ = postprocessing_state[HiddenMarkovModelProbability.start.name]
    hmm_model.transmat_ = postprocessing_state[HiddenMarkovModelProbability.transition.name]

    return hmm_model.predict(predictions.reshape(-1, 1))
