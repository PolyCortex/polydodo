import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({
  response: null,
  isFormSubmitted: false,
  postFormError: null,
});

export default useGlobalState;
