import { createContext, useContext, useState } from "react";

const EditionFilterContext = createContext();

export const EditionFilterProvider = ({ children }) => {
  const [selectedEdition, setSelectedEdition] = useState(null);

  return (
    <EditionFilterContext.Provider value={{ selectedEdition, setSelectedEdition }}>
      {children}
    </EditionFilterContext.Provider>
  );
};

export const useEditionFilter = () => useContext(EditionFilterContext);