'use client';

import Rating from './Rating';
import TrustBadge from './TrustBadge';

interface TrustSignalsProps {
  rating?: number;
  totalRatings?: number;
  verified?: boolean;
  responseTime?: string;
  memberSince?: string;
  totalRentals?: number;
  className?: string;
}

export default function TrustSignals({
  rating,
  totalRatings,
  verified = false,
  responseTime,
  memberSince,
  totalRentals,
  className = '',
}: TrustSignalsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {rating && (
        <Rating 
          rating={rating} 
          totalRatings={totalRatings} 
          size="md"
          showCount={true}
        />
      )}
      {verified && (
        <TrustBadge type="verified" />
      )}
      {responseTime && (
        <TrustBadge type="response-time" value={responseTime} />
      )}
      {memberSince && (
        <TrustBadge type="member-since" value={memberSince} />
      )}
      {totalRentals && (
        <TrustBadge type="total-rentals" value={totalRentals} />
      )}
    </div>
  );
}

