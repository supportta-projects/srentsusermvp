'use client';

/* STATIC TEST VERSION - No conditions, no animations, no dynamic imports */
/* Use this to verify if the issue is from conditional rendering or caching */

export default function FeaturesSectionStatic() {
  return (
    <section id="features" className="py-10 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 bg-black" data-variant="static-test">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2.5 sm:mb-4 leading-tight px-1">
            Everything You Need to Manage Your Rental Business
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-400 max-w-2xl mx-auto px-3 leading-relaxed">
            Powerful features designed specifically for rental shops. All included in every plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8" data-debug="features-grid-static">
          {/* Static Card 1 - Inventory Management */}
          <div className="feature-card group relative overflow-hidden border border-white/8 rounded-2xl sm:rounded-2xl lg:rounded-3xl bg-[#0F0F0F]" data-card-index="0" data-card-title="Inventory Management">
            <div className="relative z-10 flex flex-col h-full">
              <div className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[280px] overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#000000] sm:from-[#0F0F0F] sm:via-[#0F0F0F] sm:to-[#000000]">
                <div className="w-full h-full flex items-center justify-center p-5 md:hidden">
                  <img
                    src="/png/InventoryOverview.png"
                    alt="Inventory Management"
                    className="w-full h-full object-contain object-center max-h-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <img
                  src="/svg/InventoryOverview.svg"
                  alt="Inventory Management"
                  className="hidden md:block w-full h-full object-contain object-center p-4 sm:p-5 md:p-6 lg:p-8"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex-1 flex flex-col p-5 sm:p-6 lg:p-7">
                <div className="mb-4 sm:mb-5">
                  <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626] border shadow-md sm:shadow-lg">
                    <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  Inventory Management
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed flex-1">
                  Track all your rental items in one place. Add products, set availability, manage stock levels, and never lose track of your equipment.
                </p>
              </div>
            </div>
          </div>

          {/* Static Card 2 - Order Management */}
          <div className="feature-card group relative overflow-hidden border border-white/8 rounded-2xl sm:rounded-2xl lg:rounded-3xl bg-[#0F0F0F]" data-card-index="1" data-card-title="Order Management">
            <div className="relative z-10 flex flex-col h-full">
              <div className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[280px] overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#000000] sm:from-[#0F0F0F] sm:via-[#0F0F0F] sm:to-[#000000]">
                <div className="w-full h-full flex items-center justify-center p-5 md:hidden">
                  <img
                    src="/png/OrdersManagement.png"
                    alt="Order Management"
                    className="w-full h-full object-contain object-center max-h-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <img
                  src="/svg/OrdersManagement.svg"
                  alt="Order Management"
                  className="hidden md:block w-full h-full object-contain object-center p-4 sm:p-5 md:p-6 lg:p-8"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex-1 flex flex-col p-5 sm:p-6 lg:p-7">
                <div className="mb-4 sm:mb-5">
                  <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6] border shadow-md sm:shadow-lg">
                    <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  Order Management
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed flex-1">
                  Handle bookings, returns, and payments seamlessly. Track order status, manage rental periods, and process payments all in one dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Static Card 3 - Customer Database */}
          <div className="feature-card group relative overflow-hidden border border-white/8 rounded-2xl sm:rounded-2xl lg:rounded-3xl bg-[#0F0F0F]" data-card-index="2" data-card-title="Customer Database">
            <div className="relative z-10 flex flex-col h-full">
              <div className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[280px] overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#000000] sm:from-[#0F0F0F] sm:via-[#0F0F0F] sm:to-[#000000]">
                <div className="w-full h-full flex items-center justify-center p-5 md:hidden">
                  <img
                    src="/png/RentalDashboard.png"
                    alt="Customer Database"
                    className="w-full h-full object-contain object-center max-h-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <img
                  src="/svg/InventoryOverview.svg"
                  alt="Customer Database"
                  className="hidden md:block w-full h-full object-contain object-center p-4 sm:p-5 md:p-6 lg:p-8"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex-1 flex flex-col p-5 sm:p-6 lg:p-7">
                <div className="mb-4 sm:mb-5">
                  <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981] border shadow-md sm:shadow-lg">
                    <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  Customer Database
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed flex-1">
                  Store customer details and rental history. Build lasting relationships with your customers by tracking their preferences and rental patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

