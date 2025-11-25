'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Customer } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

// User type matching the expected interface
interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  customer: Customer | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert Supabase user to AppUser
function mapSupabaseUserToAppUser(supabaseUser: SupabaseUser | null): AppUser | null {
  if (!supabaseUser) return null;
  
  return {
    uid: supabaseUser.id,
    email: supabaseUser.email,
    displayName: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.display_name || null,
  };
}

// Helper to create Customer from Supabase user
function createCustomerFromUser(supabaseUser: SupabaseUser | null): Customer | null {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.display_name || '',
    phone: supabaseUser.user_metadata?.phone || undefined,
    createdAt: new Date(supabaseUser.created_at),
    updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
    favoriteShops: [],
    favoriteProducts: [],
    createdBy: 'self',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial session and set up auth state listener
  useEffect(() => {
    let mounted = true;

    // Get initial session (optimized - only if not already available)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      const supabaseUser = session?.user || null;
      setUser(mapSupabaseUserToAppUser(supabaseUser));
      setCustomer(createCustomerFromUser(supabaseUser));
      setLoading(false);
    });

    // Listen for auth state changes (this will also fire immediately with current session)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      const supabaseUser = session?.user || null;
      setUser(mapSupabaseUserToAppUser(supabaseUser));
      setCustomer(createCustomerFromUser(supabaseUser));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUser = session?.user || null;
      setUser(mapSupabaseUserToAppUser(supabaseUser));
      setCustomer(createCustomerFromUser(supabaseUser));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    // Optimistically update state immediately with returned user data
    // onAuthStateChange will also fire, but this gives instant feedback
    if (data.user) {
      setUser(mapSupabaseUserToAppUser(data.user));
      setCustomer(createCustomerFromUser(data.user));
    }
    // Note: onAuthStateChange listener will also update state, but having this
    // ensures immediate UI update without waiting for the listener
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          phone: phone?.trim() || undefined,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Optimistically update state immediately with returned user data
    // onAuthStateChange will also fire, but this gives instant feedback
    if (data.user) {
      setUser(mapSupabaseUserToAppUser(data.user));
      setCustomer(createCustomerFromUser(data.user));
    }
    // Note: onAuthStateChange listener will also update state, but having this
    // ensures immediate UI update without waiting for the listener
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ user, customer, loading, signIn, signUp, signOut, refreshUser }}>
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
