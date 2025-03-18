
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Music, HandCoins, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedDJs from '@/components/FeaturedDJs';
import { connectSBTCWallet, isSBTCWalletConnected } from '@/utils/sbtcHelpers';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDJProfile, setIsDJProfile] = useState(false);
  const navigate = useNavigate();
  
  // Helper function to abbreviate addresses
  const abbreviateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Check authentication status and DJ profile status
    const checkAuthAndDJStatus = async () => {
      try {
        // Check wallet connection first
        const walletConnected = await isSBTCWalletConnected();
        setIsWalletConnected(walletConnected);
        
        // Check authentication status
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsLoggedIn(true);
          
          // Check if user has a DJ profile
          const { data: djProfile } = await supabase
            .from('dj_profiles')
            .select('id')
            .eq('id', data.session.user.id)
            .single();
            
          setIsDJProfile(!!djProfile);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    
    checkAuthAndDJStatus();
    
    return () => clearTimeout(timeout);
  }, []);
  
  const handleConnectWallet = async () => {
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
            toast.success("Wallet connected successfully!");
            
            // Use addresses from the connection result if available
            if (result.addresses) {
              const stacksAddress = result.addresses.find(addr => addr.symbol === "STX")?.address;
              if (stacksAddress) {
                setUserAddress(stacksAddress);
              }
            }
            
            // Check auth status after wallet connection
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              setIsLoggedIn(true);
              
              // Check for DJ profile
              const { data: djProfile } = await supabase
                .from('dj_profiles')
                .select('id')
                .eq('id', data.session.user.id)
                .single();
                
              setIsDJProfile(!!djProfile);
            }
          } else {
            toast.error("Failed to connect wallet", {
              description: "Connection was rejected or failed. Please try again."
            });
          }
        } catch (error) {
          console.error("Error connecting to wallet:", error);
          toast.error("Error connecting to wallet", {
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
            
            // Check auth status
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              setIsLoggedIn(true);
              
              // Check for DJ profile
              const { data: djProfile } = await supabase
                .from('dj_profiles')
                .select('id')
                .eq('id', data.session.user.id)
                .single();
                
              setIsDJProfile(!!djProfile);
            }
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
  
  // Display wallet address or appropriate button text
  const getWalletButtonText = () => {
    if (isConnecting) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          <span>Connecting...</span>
        </div>
      );
    } else if (isWalletConnected) {
      if (userAddress) {
        return abbreviateAddress(userAddress);
      } else {
        return "Wallet Connected";
      }
    } else {
      return "Connect Wallet";
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16">
      <div 
        className="absolute inset-0 z-[-1] overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 85, 0, 0.05) 0%, rgba(255, 255, 255, 0) 50%), ' +
                      'radial-gradient(circle at 80% 30%, rgba(255, 122, 0, 0.05) 0%, rgba(255, 255, 255, 0) 50%)'
        }}
      />
      
      <div 
        className={`container mx-auto px-4 pt-28 pb-8 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6">
              Support Your Favorite <br />
              <span className="text-soundcloud">SoundCloud Artists</span> <br />
              Directly
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              TipTune makes it easy to support your favorite SoundCloud DJs with Bitcoin 
              micropayments, creating a direct connection between artists and fans.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-soundcloud hover:bg-soundcloud-dark text-white font-bold px-8 py-4 
                rounded-full shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1 
                flex items-center justify-center"
                size="lg"
                onClick={handleConnectWallet}
                disabled={isConnecting}
              >
                {getWalletButtonText()}
                <div className="ml-2">→</div>
              </Button>
              
              {isLoggedIn && !isDJProfile && (
                <Link to="/register-dj">
                  <Button 
                    variant="outline" 
                    className="border-2 border-soundcloud hover:bg-soundcloud/10 text-soundcloud font-bold
                    px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1
                    w-full sm:w-auto flex items-center"
                    size="lg"
                  >
                    <Music className="mr-2 h-5 w-5" />
                    Register as DJ
                  </Button>
                </Link>
              )}
              
              {!isLoggedIn && (
                <Link to="/dj/featured">
                  <Button 
                    variant="outline" 
                    className="border-2 border-soundcloud hover:bg-soundcloud/10 text-soundcloud font-bold
                    px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1
                    w-full sm:w-auto"
                    size="lg"
                  >
                    Discover DJs
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative z-10 bg-white rounded-2xl shadow-hard overflow-hidden">
              <div className="bg-soundcloud h-1" />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-soundcloud/10 rounded-full flex items-center justify-center">
                    <Music className="h-6 w-6 text-soundcloud" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Melodic Master</h3>
                    <p className="text-sm text-muted-foreground">House · 42.5K followers</p>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden bg-secondary/50 h-48 mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <Music className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mt-2">SoundCloud Player</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-2">
                  <Button className="flex-1 bg-soundcloud text-white hover:bg-soundcloud-dark">
                    <HandCoins size={16} className="mr-2" />
                    Tip DJ
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart size={16} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="absolute top-8 right-8 w-64 h-64 bg-tipOrange-100 rounded-full filter blur-3xl opacity-20 z-0" />
            <div className="absolute bottom-12 left-12 w-32 h-32 bg-soundcloud rounded-full filter blur-3xl opacity-10 z-0" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div 
          className="cursor-pointer animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-900/5 
          shadow-lg rounded-full flex items-center justify-center"
          onClick={() => {
            const featuredSection = document.getElementById('featured-djs');
            if (featuredSection) {
              featuredSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <svg className="w-6 h-6 text-soundcloud" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

const FeatureSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How TipTune Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            TipTune provides a seamless way to support SoundCloud DJs using SBTC micropayments,
            creating a direct connection between artists and their fans.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              icon: <Music className="h-8 w-8 text-soundcloud" />,
              title: "Discover Artists",
              description: "Browse our curated selection of talented SoundCloud DJs from various genres and styles."
            },
            {
              icon: <HandCoins className="h-8 w-8 text-soundcloud" />,
              title: "Send Tips with SBTC",
              description: "Support your favorite DJs directly with SBTC micropayments - quick, easy, and secure."
            },
            {
              icon: <Heart className="h-8 w-8 text-soundcloud" />,
              title: "Connect with DJs",
              description: "Follow your favorite artists, get updates on new tracks, and show your appreciation."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass p-8 rounded-2xl text-center hover:transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mx-auto bg-soundcloud/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedDJs />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
