'use client';

import { useState } from 'react';
import Link from 'next/link';

const CITIES = ['All Cities', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai'];

interface HeaderProps {
  onSearch?: (query: string) => void;
  onCityChange?: (city: string) => void;
  selectedCity?: string;
}

export default function Header({ onSearch, onCityChange, selectedCity = 'All Cities' }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

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
        <div className="absolute top-0 left-[10%] w-64 h-64 bg-gradient-to-br from-[#10b981]/20 to-[#059669]/10 rounded-full blur-3xl floating-gradient-1"></div>
        <div className="absolute top-0 right-[15%] w-80 h-80 bg-gradient-to-bl from-[#34d399]/15 to-[#10b981]/20 rounded-full blur-3xl floating-gradient-2"></div>
        <div className="absolute bottom-0 left-[20%] w-72 h-72 bg-gradient-to-tr from-[#059669]/15 to-[#34d399]/10 rounded-full blur-3xl floating-gradient-3"></div>
        <div className="absolute top-1/2 right-[5%] w-60 h-60 bg-gradient-to-r from-[#10b981]/18 to-[#059669]/12 rounded-full blur-3xl floating-gradient-4"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              {/* Realistic Sappotta Fruit Logo */}
              <svg 
                viewBox="0 0 40 40" 
                className="w-7 h-7"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Stem */}
                <rect 
                  x="18" 
                  y="2" 
                  width="2" 
                  height="4" 
                  fill="#8b6f47"
                  stroke="#6b5235"
                  strokeWidth="0.5"
                />
                
                {/* Left Leaf - Natural Shape */}
                <path 
                  d="M14 4 Q12 6 13 9 Q14 12 16 10 Q15 8 15 6 Q14.5 5 14 4 Z" 
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth="0.3"
                />
                {/* Left Leaf Vein */}
                <path 
                  d="M14 4 Q14.5 6 15 8" 
                  stroke="#059669"
                  strokeWidth="0.4"
                  fill="none"
                />
                
                {/* Right Leaf - Natural Shape */}
                <path 
                  d="M26 4 Q28 6 27 9 Q26 12 24 10 Q25 8 25 6 Q25.5 5 26 4 Z" 
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth="0.3"
                />
                {/* Right Leaf Vein */}
                <path 
                  d="M26 4 Q25.5 6 25 8" 
                  stroke="#059669"
                  strokeWidth="0.4"
                  fill="none"
                />
                
                {/* Fruit Body - Realistic Oval Shape */}
                <ellipse 
                  cx="20" 
                  cy="24" 
                  rx="7" 
                  ry="9" 
                  fill="#c49a6c"
                  stroke="#8b6f47"
                  strokeWidth="0.5"
                />
                
                {/* Fruit Texture/Shading */}
                <ellipse 
                  cx="18" 
                  cy="22" 
                  rx="4" 
                  ry="6" 
                  fill="#d4a574"
                  opacity="0.6"
                />
                <ellipse 
                  cx="22" 
                  cy="26" 
                  rx="3" 
                  ry="5" 
                  fill="#a67c52"
                  opacity="0.4"
                />
                
                {/* Natural Highlight */}
                <ellipse 
                  cx="17" 
                  cy="21" 
                  rx="2" 
                  ry="3" 
                  fill="#e8c9a0"
                  opacity="0.5"
                />
              </svg>
            </div>
            <span className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              srents
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
                        className="w-full px-3 py-2 pl-9 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981]/30 text-sm text-white placeholder-gray-500 backdrop-blur-xl"
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
              className="px-4 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-full transition-all duration-300 text-sm font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
