import { useEffect, useState } from "react";
import { csv } from "d3";

export const useCSVData = (path) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      const receivedData = await csv(path);
      setData(receivedData);
    })();
  }, [path]);
  return data;
};
