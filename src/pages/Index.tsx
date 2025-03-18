import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Music, HandCoins, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedDJs from '@/components/FeaturedDJs';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
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
    
    // Don't check wallet connection on page load
    
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
          const result = await connectsBTCWallet();
          
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
          const result = await connectsBTCWallet();
          
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
              TipCloud makes it easy to support your favorite SoundCloud DJs with Bitcoin 
              micropayments, creating a direct connection between artists and fans.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-soundcloud hover:bg-soundcloud-dark text-white font-bold px-8 py-4 
                rounded-full shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1 
                flex items-center justify-center"
                size="lg"
                onClick={isWalletConnected ? () => navigate('/') : handleConnectWallet}
                disabled={isConnecting}
              >
                {getWalletButtonText()}
                <div className="ml-2">→</div>
              </Button>
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
              <Link to="/register-dj">
                <Button 
                  variant="outline" 
                  className="border-2 border-purple-500 hover:bg-purple-500/10 text-purple-500 font-bold
                  px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1
                  w-full sm:w-auto"
                  size="lg"
                >
                  Register as DJ
                </Button>
              </Link>
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
            How TipCloud Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            TipCloud provides a seamless way to support SoundCloud DJs using sBTC micropayments,
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
              title: "Send Tips with sBTC",
              description: "Support your favorite DJs directly with sBTC micropayments - quick, easy, and secure."
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

const DJPromotionSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Are You a <span className="text-purple-600">SoundCloud DJ</span>?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Join TipCloud and start receiving sBTC tips directly from your fans. Connect your SoundCloud profile, set up your wallet, and start earning today.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="mr-4 mt-1 bg-purple-100 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Connect your SoundCloud profile</span>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 bg-purple-100 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Set up your Bitcoin wallet to receive tips</span>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 bg-purple-100 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Start receiving tips from your fans around the world</span>
              </li>
            </ul>
            <Button 
              onClick={() => navigate('/register-dj')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1"
              size="lg"
            >
              Register as DJ Now
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -right-6 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-50 z-0" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-200 rounded-full filter blur-3xl opacity-50 z-0" />
            <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-purple-600 h-2" />
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    DJ
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium">Your DJ Name</h3>
                    <p className="text-gray-500">Your favorite genre</p>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="h-3 w-24 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-500">Tips Received</div>
                    <div className="text-sm font-medium">0.0012 sBTC</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">Supporters</div>
                    <div className="text-sm font-medium">24 fans</div>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  This could be you!
                </Button>
              </div>
            </div>
          </div>
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
        <DJPromotionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
