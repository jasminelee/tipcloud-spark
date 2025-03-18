import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Check } from 'lucide-react';

import { supabase } from "@/integrations/supabase/client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DJRegistrationForm from '@/components/DJRegistrationForm';
import { Button } from '@/components/ui/button';

const RegisterDJ = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAlreadyDJ, setIsAlreadyDJ] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthAndDJStatus = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsLoggedIn(true);
          
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

        {!isLoggedIn ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <Music size={48} className="mx-auto text-soundcloud mb-4" />
              <h2 className="text-xl font-medium mb-2">Login Required</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You need to login or create an account to register as a DJ and receive tips.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/connect')}
              className="bg-soundcloud hover:bg-soundcloud-dark text-white"
              size="lg"
            >
              Connect Wallet & Login
            </Button>
          </div>
        ) : isAlreadyDJ ? (
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
              onClick={() => navigate(`/dj/${supabase.auth.getUser().then(({data}) => data.user?.id)}`)}
              className="bg-soundcloud hover:bg-soundcloud-dark text-white"
              size="lg"
            >
              Go to My DJ Profile
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-secondary/30 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-medium mb-3">What you'll need:</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Your SoundCloud profile URL</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>A Bitcoin/SBTC wallet address to receive tips</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>A brief bio to tell fans about yourself</span>
                </li>
              </ul>
            </div>
            
            <DJRegistrationForm />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RegisterDJ;
