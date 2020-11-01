from hmmlearn.hmm import MultinomialHMM

from classification.config.constants import (
    HMM_EMISSION_MATRIX,
    HMM_START_PROBABILITIES,
    HMM_TRANSITION_MATRIX,
    N_STAGES,
)


def postprocess(predictions, postprocessing_state):
    hmm_model = MultinomialHMM(n_components=N_STAGES)

    hmm_model.emissionprob_ = postprocessing_state[HMM_EMISSION_MATRIX]
    hmm_model.startprob_ = postprocessing_state[HMM_START_PROBABILITIES]
    hmm_model.transmat_ = postprocessing_state[HMM_TRANSITION_MATRIX]

    return hmm_model.predict(predictions.reshape(-1, 1))
