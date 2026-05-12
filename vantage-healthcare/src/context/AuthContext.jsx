import { createContext, useContext, useState } from 'react';
import registrationKeys from '../data/registrationKeys';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vh_user');
    return saved ? JSON.parse(saved) : null;
  });

  function login(email, password) {
    const accounts = JSON.parse(localStorage.getItem('vh_accounts') || '{}');
    const account = accounts[email.toLowerCase()];
    if (!account) throw new Error('No account found with that email.');
    if (account.password !== password) throw new Error('Incorrect password.');
    const userData = { email: email.toLowerCase(), hospitalAccess: account.hospitalAccess };
    localStorage.setItem('vh_user', JSON.stringify(userData));
    setUser(userData);
  }

  function register(email, password, key) {
    const keyData = registrationKeys[key.trim().toUpperCase()];
    if (!keyData) throw new Error('Invalid registration key.');
    const accounts = JSON.parse(localStorage.getItem('vh_accounts') || '{}');
    if (accounts[email.toLowerCase()]) throw new Error('An account with this email already exists.');
    accounts[email.toLowerCase()] = { password, hospitalAccess: keyData.hospital };
    localStorage.setItem('vh_accounts', JSON.stringify(accounts));
    const userData = { email: email.toLowerCase(), hospitalAccess: keyData.hospital };
    localStorage.setItem('vh_user', JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('vh_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}