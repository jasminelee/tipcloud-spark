import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Check } from 'lucide-react';

import { supabase } from "@/integrations/supabase/client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DJRegistrationForm from '@/components/DJRegistrationForm';
import DJAuthForm from '@/components/DJAuthForm';
import { Button } from '@/components/ui/button';
import { connectSBTCWallet } from '@/utils/sbtcHelpers';

const RegisterDJ = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAlreadyDJ, setIsAlreadyDJ] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [authStep, setAuthStep] = useState<'connect-wallet' | 'email-auth' | 'profile-form'>('connect-wallet');

  useEffect(() => {
    const checkAuthAndDJStatus = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsLoggedIn(true);
          
          // Get wallet address from user metadata if available
          if (user.user_metadata?.wallet_address) {
            setWalletAddress(user.user_metadata.wallet_address);
            setAuthStep('profile-form');
          } else {
            // If no wallet address is stored, we'll need the user to connect their wallet
            setAuthStep('connect-wallet');
          }
          
          // Check if user is already registered as a DJ
          const { data: djProfile } = await supabase
            .from('dj_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (djProfile) {
            setIsAlreadyDJ(true);
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndDJStatus();
  }, []);

  const handleConnectWallet = async () => {
    try {
      const result = await connectSBTCWallet();
      
      if (result.connected && result.addresses) {
        const stacksAddress = result.addresses.find(addr => addr.symbol === "STX")?.address;
        if (stacksAddress) {
          setWalletAddress(stacksAddress);
          setAuthStep('email-auth');
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleAuthSuccess = (userId: string) => {
    setIsLoggedIn(true);
    setAuthStep('profile-form');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="h-16 w-16 border-4 border-t-soundcloud rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8 pt-32">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Register as a SoundCloud DJ</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join our community of SoundCloud DJs and start receiving SBTC tips for your awesome music.
          </p>
        </div>

        {/* Users who are already registered as DJs */}
        {isAlreadyDJ ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-medium mb-2">You're Already Registered!</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You've already registered as a DJ. Visit your profile to see your tips and manage your account.
              </p>
            </div>
            <Button 
              onClick={async () => {
                try {
                  const { data } = await supabase.auth.getUser();
                  if (data.user?.id) {
                    navigate(`/dj/${data.user.id}`);
                  } else {
                    console.error("User ID not found");
                  }
                } catch (error) {
                  console.error("Error navigating to DJ profile:", error);
                }
              }}
              className="bg-soundcloud hover:bg-soundcloud-dark text-white"
              size="lg"
            >
              Go to My DJ Profile
            </Button>
          </div>
        ) : (
          <div>
            {/* Step 1: Connect wallet */}
            {authStep === 'connect-wallet' && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-soundcloud/10 flex items-center justify-center mx-auto mb-4">
                    <Music size={32} className="text-soundcloud" />
                  </div>
                  <h2 className="text-xl font-medium mb-2">Step 1: Connect Your Wallet</h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    First, connect your Bitcoin wallet to receive tips from your fans.
                  </p>
                </div>
                <Button 
                  onClick={handleConnectWallet}
                  className="bg-soundcloud hover:bg-soundcloud-dark text-white"
                  size="lg"
                >
                  Connect Wallet
                </Button>
              </div>
            )}

            {/* Step 2: Email authentication */}
            {authStep === 'email-auth' && (
              <div className="max-w-md mx-auto">
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-medium mb-2">Step 2: Create Your Account</h2>
                  <p className="text-muted-foreground mb-6">
                    Creating an account lets you manage your DJ profile and update your details anytime.
                  </p>
                  <div className="bg-success/10 text-success rounded-md p-3 mb-6 inline-block">
                    <Check className="inline-block mr-2" size={18} />
                    <span className="text-sm">Wallet connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  </div>
                </div>
                
                <DJAuthForm 
                  onAuthSuccess={handleAuthSuccess}
                  walletAddress={walletAddress}
                />
              </div>
            )}

            {/* Step 3: DJ profile form */}
            {authStep === 'profile-form' && isLoggedIn && (
              <>
                <div className="text-center mb-8">
                  <div className="bg-success/10 text-success rounded-md p-3 mb-4 inline-block">
                    <Check className="inline-block mr-2" size={18} />
                    <span className="text-sm">Step 3: Complete Your DJ Profile</span>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-xl p-6 mb-8">
                  <h2 className="text-lg font-medium mb-3">What you'll need:</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span>Your SoundCloud profile URL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span>A brief bio to tell fans about yourself</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span>Optional: A profile image URL</span>
                    </li>
                  </ul>
                </div>
                
                <DJRegistrationForm walletAddress={walletAddress} />
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RegisterDJ;
