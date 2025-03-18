
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { isSBTCWalletConnected, connectSBTCWallet } from '@/utils/sbtcHelpers';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDJProfile, setIsDJProfile] = useState(false);
  
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Check for wallet connection status without triggering UI
      const isConnected = await isSBTCWalletConnected();
      if (!isConnected) return;
      
      // Check if user is logged in
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        setUserId(data.session.user.id);
        
        // Check if user has a DJ profile
        const { data: djProfile } = await supabase
          .from('dj_profiles')
          .select('id')
          .eq('id', data.session.user.id)
          .single();
          
        setIsDJProfile(!!djProfile);
      }
    };
    
    checkWalletConnection();
  }, [location.pathname]);
  
  const handleConnectWallet = async () => {
    try {
      // Pass explicit intent to trigger wallet UI
      await connectSBTCWallet();
      navigate('/connect');
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserId(null);
      setIsDJProfile(false);
      toast.success("Successfully signed out");
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <span className="font-display text-2xl font-bold">TipTune</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-foreground/80 ${location.pathname === '/' ? 'text-foreground' : 'text-foreground/60'}`}>
              Home
            </Link>
            <Link to="/about" className={`text-sm font-medium transition-colors hover:text-foreground/80 ${location.pathname === '/about' ? 'text-foreground' : 'text-foreground/60'}`}>
              About
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {!isDJProfile && (
                  <Link to="/register-dj">
                    <Button variant="outline" size="sm">
                      <Music className="h-4 w-4 mr-2" />
                      Register as DJ
                    </Button>
                  </Link>
                )}
                {isDJProfile && (
                  <Link to={`/dj/${userId}`}>
                    <Button variant="outline" size="sm">
                      <Music className="h-4 w-4 mr-2" />
                      My DJ Profile
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-base" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/about" className="text-base" onClick={closeMobileMenu}>
              About
            </Link>
            {isLoggedIn && !isDJProfile && (
              <Link to="/register-dj" className="text-base" onClick={closeMobileMenu}>
                Register as DJ
              </Link>
            )}
            {isLoggedIn && isDJProfile && (
              <Link to={`/dj/${userId}`} className="text-base" onClick={closeMobileMenu}>
                My DJ Profile
              </Link>
            )}
            {isLoggedIn ? (
              <Button variant="outline" onClick={handleSignOut} className="justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            ) : (
              <Button onClick={handleConnectWallet} className="justify-start">
                Connect Wallet
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
