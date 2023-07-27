import { useEffect, useState } from "react";

export const useDomLoaded = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  return domLoaded;
};
