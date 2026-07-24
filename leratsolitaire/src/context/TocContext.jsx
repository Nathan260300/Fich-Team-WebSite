import { createContext, useContext, useMemo, useState } from 'react';

const TocContext = createContext(null);

export function TocProvider({ children }) {
  const [toc, setToc] = useState([]);
  const value = useMemo(() => ({ toc, setToc }), [toc]);
  return <TocContext.Provider value={value}>{children}</TocContext.Provider>;
}

export function useToc() {
  return useContext(TocContext);
}
