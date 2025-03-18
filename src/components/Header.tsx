import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';
import { connectSBTCWallet, isSBTCWalletConnected } from '@/utils/sbtcHelpers';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const location = useLocation();
  
  // Helper function to abbreviate addresses
  const abbreviateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Don't check wallet connection on page load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleConnectWallet = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isWalletConnected) {
      // If already connected, do nothing
      return;
    }
    
    setIsConnecting(true);
    
    try {
      if (typeof window === 'undefined') {
        toast.error("Not in browser environment");
        return;
      }
      
      // Check if Leather wallet is installed
      if (window.LeatherProvider) {
        try {
          const connected = await connectSBTCWallet();
          
          if (connected) {
            setIsWalletConnected(true);
            toast.success("Leather wallet connected successfully!");
            
            // Get the user's Stacks address and abbreviate it
            try {
              const response = await window.LeatherProvider.request("getAddresses");
              if (response?.result?.addresses) {
                const stacksAddress = response.result.addresses.find(addr => addr.symbol === "STX")?.address;
                if (stacksAddress) {
                  setUserAddress(stacksAddress);
                }
              }
            } catch (addressError) {
              console.error("Error fetching wallet addresses:", addressError);
            }
          } else {
            toast.error("Failed to connect Leather wallet", {
              description: "Please try again or check if Leather wallet is properly set up"
            });
          }
        } catch (error) {
          console.error("Error connecting to Leather wallet:", error);
          toast.error("Error connecting to Leather wallet", {
            description: error instanceof Error ? error.message : "Unknown error occurred"
          });
        }
        
        setIsConnecting(false);
        return;
      }
      
      // Check for other wallet types
      if (window.btc) {
        try {
          const connected = await connectSBTCWallet();
          
          if (connected) {
            setIsWalletConnected(true);
            toast.success("Wallet connected successfully!");
          } else {
            toast.error("Failed to connect wallet", {
              description: "Please try again or use a different wallet"
            });
          }
        } catch (error) {
          console.error("Error connecting wallet:", error);
          toast.error("Error connecting wallet", {
            description: error instanceof Error ? error.message : "Unknown error occurred"
          });
        }
        
        setIsConnecting(false);
        return;
      }
      
      // No wallet detected
      toast.error("No Bitcoin wallet detected", {
        description: "Please install Leather or another compatible wallet"
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error occurred", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'DJs', path: '/dj/featured' },
    { name: 'About', path: '/about' },
  ];
  
  // Display wallet address if connected
  const getWalletButtonText = () => {
    if (isConnecting) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          <span>Connecting...</span>
        </div>
      );
    } else if (isWalletConnected) {
      return userAddress ? abbreviateAddress(userAddress) : "Wallet Connected";
    } else {
      return "Connect Wallet";
    }
  };
  
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
            <Button 
              className="bg-soundcloud hover:bg-soundcloud-dark text-white font-medium px-6 py-2 rounded-full 
              shadow-md transition-all duration-300 ease-out transform hover:-translate-y-0.5"
              onClick={handleConnectWallet}
              disabled={isConnecting}
            >
              {getWalletButtonText()}
            </Button>
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
              <Button 
                className="bg-soundcloud hover:bg-soundcloud-dark text-white font-medium px-6 py-2 rounded-full 
                shadow-md transition-all duration-300 ease-out"
                onClick={handleConnectWallet}
                disabled={isConnecting}
              >
                {getWalletButtonText()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
