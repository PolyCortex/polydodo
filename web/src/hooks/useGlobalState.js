import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({
  response: null,
});

export default useGlobalState;
