import React, { useEffect, useRef } from 'react';

const D3Component = React.memo(({ callback }) => {
  const ref = useRef();
  useEffect(() => callback(ref.current));
  return <svg ref={ref} />;
});

export default D3Component;
