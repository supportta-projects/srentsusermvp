'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Customer } from '@/types';

interface AuthContextType {
  user: User | null;
  customer: Customer | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch customer data from Firestore
        try {
          const customerDoc = await getDoc(doc(db, 'customers', firebaseUser.uid));
          if (customerDoc.exists()) {
            const data = customerDoc.data();
            setCustomer({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: data.name || firebaseUser.displayName || '',
              phone: data.phone,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              favoriteShops: data.favoriteShops || [],
              favoriteProducts: data.favoriteProducts || [],
              createdBy: data.createdBy,
            });
          } else {
            // Create customer document if it doesn't exist (for vendor-created accounts)
            const customerData = {
              email: firebaseUser.email,
              name: firebaseUser.displayName || '',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              favoriteShops: [],
              favoriteProducts: [],
              createdBy: 'vendor', // Assume vendor-created if doc doesn't exist
            };
            await setDoc(doc(db, 'customers', firebaseUser.uid), customerData);
            setCustomer({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              createdAt: new Date(),
              updatedAt: new Date(),
              favoriteShops: [],
              favoriteProducts: [],
              createdBy: 'vendor',
            });
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      } else {
        setCustomer(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase Auth profile
    await updateProfile(userCredential.user, { displayName: name });
    
    // Create customer document in Firestore
    const customerData = {
      email,
      name,
      phone: phone || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      favoriteShops: [],
      favoriteProducts: [],
      createdBy: 'self',
    };
    
    await setDoc(doc(db, 'customers', userCredential.user.uid), customerData);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
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

