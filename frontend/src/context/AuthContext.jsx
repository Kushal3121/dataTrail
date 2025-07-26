import { createContext, useContext, useEffect, useState } from 'react';

// Create context
const AuthContext = createContext();

// Hook to use context
export const useAuth = () => useContext(AuthContext);

// Default users (for testing)
const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'analyst', password: 'analyst123', role: 'Analyst' },
  { username: 'viewer', password: 'viewer123', role: 'Viewer' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, role }

  // Load users and session on mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
    }

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const signUp = ({
    username,
    password,
    role,
    firstName,
    lastName,
    organization,
    address,
  }) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const exists = users.find((u) => u.username === username);
    if (exists) throw new Error('Username already exists');

    const newUser = {
      username,
      password,
      role,
      firstName,
      lastName,
      organization,
      address,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const signIn = ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!existingUser) throw new Error('Invalid credentials');

    const loggedInUser = { username, role: existingUser.role };
    setUser(loggedInUser);
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    return existingUser.role;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
