import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({
  response: null,
  submittedFormData: null,
  postFormError: null,
});

export default useGlobalState;
