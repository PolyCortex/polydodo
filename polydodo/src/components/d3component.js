import React, { useEffect, useRef } from 'react';

const D3Component = ({ callback }) => {
    const ref = useRef(null);
    useEffect(() => callback(ref));
    return <svg ref={ref} />;
};

export default D3Component;
