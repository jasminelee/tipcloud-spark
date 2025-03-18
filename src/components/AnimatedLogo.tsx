
import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo = ({ className = "" }: AnimatedLogoProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Initial animation
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleHover = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1500);
    }
  };

  return (
    <div 
      className={`relative flex items-center ${className}`}
      onMouseEnter={handleHover}
    >
      <div className={`relative ${isAnimating ? 'animate-wave' : ''}`}>
        <Music className="h-6 w-6 text-soundcloud" />
      </div>
      <span className="ml-2 font-display font-bold text-xl tracking-tight">
        TipTune
        <span className="text-soundcloud">.</span>
      </span>
    </div>
  );
};

export default AnimatedLogo;
