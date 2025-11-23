interface RORLogoProps {
  className?: string;
  size?: number;
}

export default function RORLogo({ className = '', size = 40 }: RORLogoProps) {
  return (
    <svg
      viewBox="0 0 100 40"
      className={className}
      width={size * 2.5}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ROR Logo - Interconnected letters with red color matching the logo */}
      {/* The design shows interconnected ROR where the O connects both R's */}
      
      {/* First R - Left side */}
      <path
        d="M 5 5 L 5 35 L 11 35 L 11 22 L 17 22 L 20 12 L 14 12 L 12 20 L 11 20 L 11 5 Z"
        fill="#DC2626"
      />
      {/* First R leg extending into O */}
      <path
        d="M 17 22 L 20 22 L 22 26 L 20 26 Z"
        fill="#DC2626"
      />
      
      {/* O - Central circle that connects both R's */}
      <circle
        cx="28"
        cy="20"
        r="7"
        fill="none"
        stroke="#DC2626"
        strokeWidth="2.5"
      />
      {/* Connection from first R to O - left side */}
      <path
        d="M 20 22 L 21 20"
        stroke="#DC2626"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Second R - Right side */}
      <path
        d="M 35 5 L 35 35 L 41 35 L 41 22 L 47 22 L 50 12 L 44 12 L 42 20 L 41 20 L 41 5 Z"
        fill="#DC2626"
      />
      {/* Second R leg extending into O */}
      <path
        d="M 35 22 L 37 22 L 35 26 L 33 26 Z"
        fill="#DC2626"
      />
      {/* Connection from O to second R - right side */}
      <path
        d="M 35 20 L 36 22"
        stroke="#DC2626"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
