import { memo } from "react";

// components/UI/Avatar.tsx
interface AvatarProps {
    src?: string | null;
    fallback: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }
  
  export const Avatar: React.FC<AvatarProps> = memo(({
    src,
    fallback,
    size = 'md',
    className = '',
  }) => {
    const sizeClasses = {
      sm: 'min-w-6 h-6',
      md: 'min-w-8 h-8',
      lg: 'min-w-10 h-10',
    };
  
    if (src) {
      return (
        <img
          src={src}
          alt={fallback}
          className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        />
      );
    }
  
    return (
      <div className={`${sizeClasses[size]} basis-8 rounded-full bg-[#1774FD] flex items-center justify-center ${className}`}>
        <span className="text-white font-bold">{fallback[0].toUpperCase()}</span>
      </div>
    );
  });