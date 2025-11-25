'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import RentOrentLogo from './RentOrentLogo';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentUserProfile, getUserDisplayName } from '@/lib/supabase-profiles';

function VendorNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [profileInitial, setProfileInitial] = useState<string>('');
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();

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

  const scrollToSection = useCallback((sectionId: string) => {
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (!element) {
        setTimeout(scrollToElement, 100);
        return;
      }
      
      // Wait a bit for all lazy-loaded sections to render
      setTimeout(() => {
        const navbarHeight = 80;
        // Use offsetTop which is relative to offsetParent (usually body)
        const elementTop = element.offsetTop;
        const targetScroll = elementTop - navbarHeight;
        
        window.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
      }, 150);
    };
    
    scrollToElement();
  }, []);

  const navItems = [
    { label: 'Features', href: '#features', onClick: () => scrollToSection('features') },
    { label: 'Pricing', href: '#pricing', onClick: () => scrollToSection('pricing') },
    { label: 'How It Works', href: '#how-it-works', onClick: () => scrollToSection('how-it-works') },
    { label: 'FAQ', href: '#faq', onClick: () => scrollToSection('faq') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 md:bg-black/80 backdrop-blur-sm md:backdrop-blur-md border-b border-white/10 gpu-accelerated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <button
              onClick={() => router.push('/')}
              className="flex items-center"
            >
              <RentOrentLogo size="md" />
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.onClick) item.onClick();
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -2 }}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                style={{ willChange: 'transform, opacity' }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {authLoading ? (
              <div className="w-8 h-8 border-2 border-gray-600 border-t-[#DC2626] rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#DC2626] flex items-center justify-center text-white font-semibold text-xs">
                    {profileInitial || <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden lg:inline">{displayName || 'User'}</span>
                </motion.button>
                
                <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[49]" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 z-[100] overflow-hidden backdrop-blur-xl"
                        style={{ willChange: 'transform, opacity' }}
                    >
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
                          } catch (error) {
                            console.error('Error signing out:', error);
                          }
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-medium rounded-lg transition-all duration-200"
                  style={{ willChange: 'transform, opacity' }}
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button / Profile Icon */}
          <div className="md:hidden">
            {authLoading ? (
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin flex items-center justify-center"></div>
            ) : user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
                style={{ willChange: 'transform, opacity' }}
              >
                {profileInitial ? (
                  <span className="text-white font-semibold text-sm">{profileInitial}</span>
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </button>
            ) : (
              <button
                className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10"
            style={{ willChange: 'height, opacity' }}
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    if (item.onClick) item.onClick();
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {authLoading ? (
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : user ? (
                  <>
                    <div className="px-4 py-3 bg-white/5 rounded-lg mb-2 border border-white/10">
                      <p className="text-sm text-white font-medium">{displayName || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors rounded-lg"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await signOut();
                          setIsMenuOpen(false);
                          router.push('/');
                        } catch (error) {
                          console.error('Error signing out:', error);
                        }
                      }}
                      className="block w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors rounded-lg text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg"
                    >
                      Sign In
                    </Link>
                    <button
                      onClick={() => {
                        router.push('/register');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile User Menu Dropdown (when profile icon clicked) */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed top-16 left-0 right-0 bg-[#1a1a1a] border-b border-white/10 z-[100] backdrop-blur-xl"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="px-4 py-4 space-y-2">
              <div className="px-4 py-3 bg-white/5 rounded-lg mb-2 border border-white/10">
                <p className="text-sm text-white font-medium">{displayName || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="block w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors rounded-lg"
              >
                Profile
              </Link>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                    setIsUserMenuOpen(false);
                    router.push('/');
                  } catch (error) {
                    console.error('Error signing out:', error);
                  }
                }}
                className="block w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors rounded-lg text-left"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default memo(VendorNavbar);

