'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RORLogo from './RORLogo';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentUserProfile, getUserDisplayName } from '@/lib/supabase-profiles';
import { User } from 'lucide-react';

const CITIES = ['All Cities', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai'];

interface HeaderProps {
  onSearch?: (query: string) => void;
  onCityChange?: (city: string) => void;
  selectedCity?: string;
}

export default function Header({ onSearch, onCityChange, selectedCity = 'All Cities' }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [profileInitial, setProfileInitial] = useState<string>('');
  
  const { user, customer, signOut, loading: authLoading } = useAuth();

  // Fetch profile and update display name
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const profile = await getCurrentUserProfile();
        const name = getUserDisplayName(profile, user.email);
        setDisplayName(name);
        setProfileInitial(name.charAt(0).toUpperCase());
      } else {
        setDisplayName('');
        setProfileInitial('');
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleCitySelect = (city: string) => {
    const cityValue = city === 'All Cities' ? '' : city;
    onCityChange?.(cityValue);
    setIsCityDropdownOpen(false);
    setCitySearchQuery('');
  };

  const filteredCities = CITIES.filter(city =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 relative">
      {/* Floating Gradient Background Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-64 h-64 bg-gradient-to-br from-[#DC2626]/20 to-[#B91C1C]/10 rounded-full blur-3xl floating-gradient-1"></div>
        <div className="absolute top-0 right-[15%] w-80 h-80 bg-gradient-to-bl from-[#EF4444]/15 to-[#DC2626]/20 rounded-full blur-3xl floating-gradient-2"></div>
        <div className="absolute bottom-0 left-[20%] w-72 h-72 bg-gradient-to-tr from-[#B91C1C]/15 to-[#EF4444]/10 rounded-full blur-3xl floating-gradient-3"></div>
        <div className="absolute top-1/2 right-[5%] w-60 h-60 bg-gradient-to-r from-[#DC2626]/18 to-[#B91C1C]/12 rounded-full blur-3xl floating-gradient-4"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 overflow-hidden">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <RORLogo size={32} className="text-[#DC2626]" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
              rentorent
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment..."
                className="w-full px-5 py-3 pl-11 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 text-sm text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-xl"
              />
              <svg className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* City Selector */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="hidden sm:inline">{selectedCity}</span>
              <span className="sm:hidden">City</span>
              <svg className={`w-4 h-4 transition-transform duration-300 ${isCityDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isCityDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[49]" 
                  onClick={() => {
                    setIsCityDropdownOpen(false);
                    setCitySearchQuery('');
                  }}
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 z-[100] overflow-hidden backdrop-blur-2xl animate-scale-in">
                  {/* City Search Input */}
                  <div className="p-3 border-b border-white/5">
                    <div className="relative">
                      <input
                        type="text"
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        placeholder="Search city..."
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-3 py-2 pl-9 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-sm text-white placeholder-gray-500 backdrop-blur-xl"
                      />
                      <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* City List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <button
                          key={city}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCitySelect(city);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors duration-200 ${
                            selectedCity === city ? 'bg-white/5 text-white font-medium' : 'text-gray-300'
                          }`}
                        >
                          {city}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No cities found
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center ml-2 sm:ml-4 flex-shrink-0">
            {authLoading ? (
              <div className="w-8 h-8 border-2 border-gray-600 border-t-[#DC2626] rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#DC2626] flex items-center justify-center text-white font-semibold text-xs">
                    {profileInitial || <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:inline">{displayName || 'User'}</span>
                </button>
                
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[49]" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 z-[100] overflow-hidden backdrop-blur-xl">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm text-white font-medium">{displayName || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                      >
                        Profile
                      </Link>
                      <div className="border-t border-white/5 my-1" />
                      <button
                        onClick={async () => {
                          try {
                            await signOut();
                            setIsUserMenuOpen(false);
                            router.push('/');
                            // Removed router.refresh() - not needed, causes unnecessary reload
                          } catch (error) {
                            console.error('Error signing out:', error);
                          }
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3 animate-slide-up">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-white/20 text-sm text-white placeholder-gray-500 backdrop-blur-xl"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-full transition-all duration-300 text-sm font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
