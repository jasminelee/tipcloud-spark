
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'DJs', path: '/dj/featured' },
    { name: 'About', path: '/about' },
  ];
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out
      ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-soft py-3' : 'bg-transparent py-5'}`}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="z-10">
            <AnimatedLogo />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200
                  ${location.pathname === link.path 
                    ? 'text-soundcloud' 
                    : 'text-foreground/80 hover:text-soundcloud'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/connect">
              <Button className="bg-soundcloud hover:bg-soundcloud-dark text-white font-medium px-6 py-2 rounded-full 
                shadow-md transition-all duration-300 ease-out transform hover:-translate-y-0.5">
                Connect Wallet
              </Button>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden z-10 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Mobile Menu */}
          <div className={`fixed inset-0 bg-white z-0 transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 pt-16">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium text-xl transition-colors duration-200
                    ${location.pathname === link.path 
                      ? 'text-soundcloud' 
                      : 'text-foreground/80 hover:text-soundcloud'}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/connect" className="mt-4">
                <Button className="bg-soundcloud hover:bg-soundcloud-dark text-white font-medium px-6 py-2 rounded-full 
                  shadow-md transition-all duration-300 ease-out">
                  Connect Wallet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
