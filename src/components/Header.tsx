import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Music } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';
import { connectSBTCWallet, isSBTCWalletConnected } from '@/utils/sbtcHelpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
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
    
    // Check if user is logged in with Supabase
    const checkUserAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };
    
    checkUserAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      authListener.subscription.unsubscribe();
    };
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
          const result = await connectSBTCWallet();
          
          if (result.connected) {
            setIsWalletConnected(true);
            toast.success("Leather wallet connected successfully!");
            
            // Use addresses from the connection result if available
            if (result.addresses) {
              const stacksAddress = result.addresses.find(addr => addr.symbol === "STX")?.address;
              if (stacksAddress) {
                setUserAddress(stacksAddress);
              }
            }
          } else {
            toast.error("Failed to connect Leather wallet", {
              description: "Connection was rejected or failed. Please try again."
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
          const result = await connectSBTCWallet();
          
          if (result.connected) {
            setIsWalletConnected(true);
            toast.success("Wallet connected successfully!");
          } else {
            toast.error("Failed to connect wallet", {
              description: "Connection was rejected or failed. Please try again."
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find DJs', path: '/dj/featured' },
    { name: 'About', path: '/about' },
    { name: 'Register as DJ', path: '/register-dj' },
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full border-soundcloud text-soundcloud">
                    <User size={16} className="mr-2" />
                    {user.email ? user.email.split('@')[0] : "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dj/' + user.id)}>
                    <Music className="mr-2 h-4 w-4" />
                    <span>DJ Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="bg-soundcloud hover:bg-soundcloud-dark text-white font-medium px-6 py-2 rounded-full 
                shadow-md transition-all duration-300 ease-out transform hover:-translate-y-0.5"
                onClick={handleConnectWallet}
                disabled={isConnecting}
              >
                {getWalletButtonText()}
              </Button>
            )}
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
              
              {user ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Signed in as</div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                  <Button onClick={() => navigate('/dj/' + user.id)} variant="outline" className="w-full">
                    <Music className="mr-2 h-4 w-4" />
                    DJ Profile
                  </Button>
                  <Button onClick={handleLogout} variant="outline" className="text-red-500 border-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <Button 
                  className="bg-soundcloud hover:bg-soundcloud-dark text-white font-medium px-6 py-2 rounded-full 
                  shadow-md transition-all duration-300 ease-out"
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                >
                  {getWalletButtonText()}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
