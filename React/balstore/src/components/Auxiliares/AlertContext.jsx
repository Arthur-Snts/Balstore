import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  function showAlert(message, type = "info") {
    setAlert({ message, type });

    // remover automaticamente depois de 3s
    setTimeout(() => setAlert(null), 3000);
  }

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
