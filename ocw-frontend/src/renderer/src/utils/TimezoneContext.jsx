import React, { createContext, useContext, useState } from 'react';

const TimezoneContext = createContext();

export const TimezoneProvider = ({ children }) => {
  const [timezone, setTimezone] = useState('America/Mexico_City');

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => useContext(TimezoneContext);