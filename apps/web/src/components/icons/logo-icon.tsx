import type { LucideProps } from 'lucide-react';
import * as React from 'react';

export const LogoIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ color = 'currentColor', size = 24, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        fill={color}
        height={size}
        width={size}
        viewBox="0 0 184.751 184.751"
        {...props}
      >
        <title>Logo</title>
        <path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z" />
      </svg>
    );
  }
);

LogoIcon.displayName = 'LogoIcon';
