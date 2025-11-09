import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  return (
    <AppContext.Provider value={{ posts, setPosts, categories, setCategories, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};
