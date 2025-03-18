import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Music, HandCoins, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedDJs from '@/components/FeaturedDJs';
import { connectSBTCWallet, isSBTCWalletConnected } from '@/utils/sbtcHelpers';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const navigate = useNavigate();
  
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
          const connected = await connectSBTCWallet();
          
          if (connected) {
            setIsWalletConnected(true);
            toast.success("Leather wallet connected successfully!");
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
  
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16">
      <div 
        className="absolute inset-0 z-[-1] overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 85, 0, 0.05) 0%, rgba(255, 255, 255, 0) 50%), ' +
                      'radial-gradient(circle at 80% 30%, rgba(255, 122, 0, 0.05) 0%, rgba(255, 255, 255, 0) 50%)'
        }}
      />
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div 
            className={`transform transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-block bg-soundcloud/10 text-soundcloud px-4 py-1 rounded-full text-sm font-medium mb-4">
              Support your favorite artists
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight tracking-tight mb-6">
              Directly Tip <span className="text-soundcloud">SoundCloud DJs</span> With Bitcoin
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              TipTune makes it easy to support your favorite SoundCloud DJs 
              with SBTC micropayments, creating a direct connection between artists and fans.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/dj/featured">
                <Button 
                  className="w-full sm:w-auto bg-soundcloud hover:bg-soundcloud-dark text-white px-8 py-6 rounded-full 
                  shadow-md hover:shadow-glow transition-all duration-300 ease-out transform hover:-translate-y-0.5"
                  size="lg"
                >
                  Discover DJs
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto px-8 py-6 rounded-full"
                size="lg"
                onClick={isWalletConnected ? () => navigate('/') : handleConnectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    Connecting...
                  </>
                ) : isWalletConnected ? (
                  <>Wallet Connected</>
                ) : (
                  <>Connect Wallet</>
                )}
              </Button>
            </div>
          </div>
          
          <div 
            className={`relative transform transition-all duration-1000 ease-out delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
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
        <button 
          className="animate-bounce p-2 rounded-full bg-white shadow-soft"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <ChevronDown size={24} className="text-muted-foreground" />
        </button>
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
