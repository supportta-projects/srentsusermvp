'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentUserProfile, upsertProfile } from '@/lib/supabase-profiles';
import { User, Building2, MapPin, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Collapsible sections state
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setFullName(profile.full_name || '');
          setPhone(profile.phone || '');
          setCompanyName(profile.company_name || '');
          setGstNumber(profile.gst_number || '');
          setAddressLine1(profile.address_line1 || '');
          setAddressLine2(profile.address_line2 || '');
          setCity(profile.city || '');
          setState(profile.state || '');
          setPostalCode(profile.postal_code || '');
          setCountry(profile.country || 'India');
        }
      } catch (err: any) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  const validateGST = (gst: string): boolean => {
    if (!gst) return true; // Optional field
    // GST format: 15 characters, alphanumeric
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };

  const validatePostalCode = (code: string): boolean => {
    if (!code) return true; // Optional if address_line1 is empty
    // Indian PIN code: 6 digits
    const pinRegex = /^[1-9][0-9]{5}$/;
    return pinRegex.test(code);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (gstNumber && !validateGST(gstNumber)) {
      setError('Invalid GST number format. Please enter a valid 15-character GST number.');
      return;
    }

    if (postalCode && !validatePostalCode(postalCode)) {
      setError('Invalid postal code. Please enter a valid 6-digit PIN code.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      // Optimistic update: Show success immediately for better UX
      // The actual save happens in the background
      const { error: updateError } = await upsertProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        company_name: companyName.trim() || undefined,
        gst_number: gstNumber.trim().toUpperCase() || undefined,
        address_line1: addressLine1.trim() || undefined,
        address_line2: addressLine2.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        postal_code: postalCode.trim() || undefined,
        country: country.trim() || 'India',
      });

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      // Show success message immediately
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setSaving(false);
      
      // Removed router.refresh() - not needed, causes unnecessary full page reload
      // The form state is already updated, no need to reload the entire page
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Link
            href="/vendor"
            className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-400 hover:text-white mb-3 sm:mb-4 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to home</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">Manage your personal and business information</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm sm:text-base backdrop-blur-sm flex items-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm sm:text-base backdrop-blur-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Card */}
        <div 
          className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl"
          style={{
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.05) inset,
              0 20px 60px rgba(0, 0, 0, 0.5),
              0 8px 32px rgba(220, 38, 38, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#DC2626] to-[#EF4444] flex items-center justify-center text-white font-bold text-2xl sm:text-3xl md:text-4xl flex-shrink-0 overflow-hidden shadow-lg shadow-[#DC2626]/30">
              {fullName ? (
                <span className="flex items-center justify-center w-full h-full">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{fullName || 'User'}</h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 break-all sm:break-normal">{user?.email}</p>
              {companyName && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <Building2 className="w-3 h-3" />
                  {companyName}
                </p>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8 pb-20 sm:pb-0">
            {/* Personal Information Section */}
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#DC2626]" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">Personal Information</h3>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed backdrop-blur-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  required
                  autoComplete="name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
                <p className="mt-1 text-xs text-gray-500">This name will be displayed in your account</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onBlur={() => handleBlur('phone')}
                  autoComplete="tel"
                  inputMode="numeric"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm"
                  placeholder="9876543210"
                />
                <p className="mt-1 text-xs text-gray-500">10-digit mobile number</p>
              </div>
            </div>

            {/* Business Information Section - Collapsible */}
            <div className="pt-4 sm:pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsBusinessOpen(!isBusinessOpen)}
                className="w-full flex items-center justify-between gap-2 mb-3 sm:mb-4 p-3 -m-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-[#DC2626]/10">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#DC2626]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">Business Information</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Company name & GST details</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(companyName || gstNumber) && !isBusinessOpen && (
                    <span className="text-xs text-[#DC2626] font-medium hidden sm:inline">Filled</span>
                  )}
                  {isBusinessOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>

              {isBusinessOpen && (
                <div className="space-y-4 sm:space-y-5 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <label htmlFor="companyName" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      onBlur={() => handleBlur('companyName')}
                      autoComplete="organization"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm"
                      placeholder="Your company or business name"
                    />
                    <p className="mt-1 text-xs text-gray-500">Optional - Your business or company name</p>
                  </div>

                  <div>
                    <label htmlFor="gstNumber" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                      GST Number
                    </label>
                    <input
                      id="gstNumber"
                      type="text"
                      value={gstNumber}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);
                        setGstNumber(value);
                      }}
                      onBlur={() => handleBlur('gstNumber')}
                      autoComplete="off"
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm ${
                        touched.gstNumber && gstNumber && !validateGST(gstNumber)
                          ? 'border-red-500/50'
                          : 'border-white/10'
                      }`}
                      placeholder="15ABCDE1234F1Z5"
                    />
                    {touched.gstNumber && gstNumber && !validateGST(gstNumber) && (
                      <p className="mt-1 text-xs text-red-400">Invalid GST format. Must be 15 characters (e.g., 15ABCDE1234F1Z5)</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">15-character GSTIN (optional)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Address Section - Collapsible */}
            <div className="pt-4 sm:pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsAddressOpen(!isAddressOpen)}
                className="w-full flex items-center justify-between gap-2 mb-3 sm:mb-4 p-3 -m-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-[#DC2626]/10">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#DC2626]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">Address</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Street, city, state & PIN</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(addressLine1 || city || state || postalCode) && !isAddressOpen && (
                    <span className="text-xs text-[#DC2626] font-medium hidden sm:inline">Filled</span>
                  )}
                  {isAddressOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>

              {isAddressOpen && (
                <div className="space-y-4 sm:space-y-5 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <label htmlFor="addressLine1" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                      Address Line 1
                    </label>
                    <input
                      id="addressLine1"
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      onBlur={() => handleBlur('addressLine1')}
                      autoComplete="street-address"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm"
                      placeholder="Street address, building, house no."
                    />
                  </div>

                  <div>
                    <label htmlFor="addressLine2" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                      Address Line 2 <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      id="addressLine2"
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      onBlur={() => handleBlur('addressLine2')}
                      autoComplete="address-line2"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm"
                      placeholder="Apartment, suite, unit, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={() => handleBlur('city')}
                        autoComplete="address-level2"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        onBlur={() => handleBlur('state')}
                        autoComplete="address-level1"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="postalCode" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Postal Code / PIN
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        onBlur={() => handleBlur('postalCode')}
                        autoComplete="postal-code"
                        inputMode="numeric"
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm ${
                          touched.postalCode && postalCode && !validatePostalCode(postalCode)
                            ? 'border-red-500/50'
                            : 'border-white/10'
                        }`}
                        placeholder="123456"
                      />
                      {touched.postalCode && postalCode && !validatePostalCode(postalCode) && (
                        <p className="mt-1 text-xs text-red-400">Invalid PIN code. Must be 6 digits</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        onBlur={() => handleBlur('country')}
                        autoComplete="country-name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all duration-200 hover:border-white/20 backdrop-blur-sm"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Sticky on mobile */}
            <div className="sticky sm:static bottom-0 left-0 right-0 pt-4 sm:pt-6 border-t border-white/5 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 pb-4 sm:pb-0 sm:bg-transparent sm:border-t sm:border-white/5">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 sm:py-3.5 bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] text-white font-semibold text-base sm:text-base rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-[#DC2626]/20 hover:shadow-[#DC2626]/30 flex items-center justify-center gap-2"
                  style={{
                    boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <Link
                  href="/vendor"
                  className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 sm:py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium text-base sm:text-base rounded-xl transition-all duration-300 text-center border border-white/10 hover:border-white/20"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>

          {/* Logout Section */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5">
            <button
              onClick={async () => {
                await signOut();
                router.push('/vendor');
              }}
              className="w-full flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-3.5 bg-white/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-medium text-base sm:text-base rounded-xl transition-all duration-300 border border-white/10 hover:border-red-500/30 active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
