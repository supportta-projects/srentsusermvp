'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Customer } from '@/types';

// Mock User type (matching Firebase User interface)
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  customer: Customer | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('vendor_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCustomer({
          id: userData.uid,
          email: userData.email || '',
          name: userData.displayName || '',
          phone: userData.phone,
          createdAt: new Date(userData.createdAt || Date.now()),
          updatedAt: new Date(userData.updatedAt || Date.now()),
          favoriteShops: [],
          favoriteProducts: [],
          createdBy: 'self',
        });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('vendor_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication - check localStorage
    const storedUsers = localStorage.getItem('vendor_users') || '{}';
    const users = JSON.parse(storedUsers);
    
    if (users[email] && users[email].password === password) {
      const userData = {
        uid: users[email].uid,
        email: email,
        displayName: users[email].name,
      };
      
      setUser(userData);
      localStorage.setItem('vendor_user', JSON.stringify(userData));
      
      setCustomer({
        id: userData.uid,
        email: email,
        name: users[email].name,
        phone: users[email].phone,
        createdAt: new Date(users[email].createdAt),
        updatedAt: new Date(),
        favoriteShops: [],
        favoriteProducts: [],
        createdBy: 'self',
      });
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    // Mock registration - store in localStorage
    const storedUsers = localStorage.getItem('vendor_users') || '{}';
    const users = JSON.parse(storedUsers);
    
    if (users[email]) {
      throw new Error('Email already registered');
    }
    
    const uid = `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = {
      uid,
      email: email,
      displayName: name,
    };
    
    users[email] = {
      uid,
      name,
      phone: phone || null,
      password, // In production, this should be hashed
      createdAt: Date.now(),
    };
    
    localStorage.setItem('vendor_users', JSON.stringify(users));
    localStorage.setItem('vendor_user', JSON.stringify(userData));
    
    setUser(userData);
    setCustomer({
      id: uid,
      email: email,
      name: name,
      phone: phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      favoriteShops: [],
      favoriteProducts: [],
      createdBy: 'self',
    });
  };

  const signOut = async () => {
    localStorage.removeItem('vendor_user');
    setUser(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ user, customer, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

