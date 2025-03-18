import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Wallet, CircleCheck, CircleAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { connectSBTCWallet, isSBTCWalletConnected } from '@/utils/sbtcHelpers';

const ConnectWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      setCheckingConnection(true);
      try {
        // First try the isSBTCWalletConnected function
        const connected = await isSBTCWalletConnected();
        
        console.log("Wallet connection passive check result:", connected);
        setIsConnected(!!connected);
        
        // If already connected, redirect to home after a short delay
        if (connected) {
          setTimeout(() => navigate('/'), 1000);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setIsConnected(false);
      } finally {
        setCheckingConnection(false);
      }
    };
    
    checkConnection();
  }, [navigate]);
  
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
            setIsConnected(true);
            toast.success("Leather wallet connected successfully!");
            // Redirect to home after successful connection
            setTimeout(() => navigate('/'), 1000);
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
            setIsConnected(true);
            toast.success("Wallet connected successfully!");
            // Redirect to home after successful connection
            setTimeout(() => navigate('/'), 1000);
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-soundcloud/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-soundcloud" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
              <p className="text-muted-foreground">
                Connect your Bitcoin wallet to send tips to SoundCloud DJs
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-lg border border-muted bg-secondary/30 flex items-start space-x-3">
                {checkingConnection ? (
                  <div className="flex items-center space-x-2 w-full justify-center py-2">
                    <div className="animate-spin h-4 w-4 border-2 border-soundcloud border-t-transparent rounded-full"></div>
                    <span className="text-sm">Checking wallet status...</span>
                  </div>
                ) : isConnected ? (
                  <>
                    <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Wallet Status</h3>
                      <p className="text-sm text-muted-foreground">
                        Your wallet is connected and ready to send tips.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CircleAlert className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Wallet Status</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your wallet to start tipping SoundCloud DJs.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {isConnected ? (
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-6"
                onClick={() => navigate('/')}
              >
                Continue to App
                <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button 
                className="w-full bg-soundcloud hover:bg-soundcloud-dark text-white font-medium py-6"
                onClick={handleConnectWallet}
                disabled={isConnecting || checkingConnection}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
                {!isConnecting && !checkingConnection && <ArrowRight size={18} className="ml-2" />}
              </Button>
            )}
            
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-medium mb-2">Don't have a wallet?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We recommend using Leather, a secure Bitcoin wallet that supports SBTC.
              </p>
              <a 
                href="https://leather.io/install" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-soundcloud hover:underline text-sm"
              >
                Install Leather Wallet
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConnectWallet;
