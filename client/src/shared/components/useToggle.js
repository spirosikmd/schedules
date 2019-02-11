import { useState, useCallback } from 'react';

function useToggle(state = false) {
  const [value, setValue] = useState(state);

  const toggle = useCallback(
    nextValue => {
      if (typeof nextValue === 'boolean') {
        setValue(nextValue);
        return;
      }

      setValue(value => !value);
    },
    [setValue]
  );

  return [value, toggle];
}

export default useToggle;
