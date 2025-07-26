import { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return storedUser?.role || '';
  });

  const updateRole = (newRole) => {
    setRole(newRole);
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ ...storedUser, role: newRole })
      );
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole: updateRole }}>
      {children}
    </RoleContext.Provider>
  );
};
