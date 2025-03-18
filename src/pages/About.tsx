
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Music, HandCoins, Shield, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div 
            className="absolute inset-0 z-[-1] opacity-60"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 85, 0, 0.05) 0%, rgba(255, 255, 255, 0) 50%), ' +
                          'radial-gradient(circle at 70% 80%, rgba(255, 122, 0, 0.05) 0%, rgba(255, 255, 255, 0) 50%)'
            }}
          />
          
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <span className="inline-block bg-soundcloud/10 text-soundcloud px-4 py-1 rounded-full text-sm font-medium mb-4">
              About TipCloud
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Connecting Fans with SoundCloud DJs
            </h1>
            <p className="text-muted-foreground text-lg mx-auto max-w-2xl mb-12">
              TipCloud is a platform designed to create a direct connection between 
              music fans and SoundCloud DJs through sBTC micropayments.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-display font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  We believe that artists should be fairly compensated for their work. 
                  TipCloud was created to solve a fundamental challenge in the music industry: 
                  how can fans directly support their favorite DJs without intermediaries 
                  taking large portions of the payment?
                </p>
                <p className="text-muted-foreground mb-6">
                  Using sBTC on Bitcoin, we've built a platform that allows for secure, 
                  instant micropayments directly to artists. This creates a more sustainable 
                  ecosystem where DJs can focus on creating great music while receiving 
                  support from their true fans.
                </p>
                <p className="text-muted-foreground">
                  Our goal is to transform the way music creators and fans interact, 
                  creating stronger connections and a more vibrant music community.
                </p>
              </div>
              
              <div className="relative">
                <div className="glass rounded-2xl p-8 relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      {
                        icon: <Music className="h-8 w-8 text-soundcloud" />,
                        title: "Artist First",
                        description: "We prioritize DJs and their creative work, providing them with tools to succeed."
                      },
                      {
                        icon: <HandCoins className="h-8 w-8 text-soundcloud" />,
                        title: "Direct Support",
                        description: "100% of tips go directly to the artists, with no platform fees taken."
                      },
                      {
                        icon: <Shield className="h-8 w-8 text-soundcloud" />,
                        title: "Secure Payments",
                        description: "sBTC provides secure, low-fee transactions on the Bitcoin network."
                      },
                      {
                        icon: <Wallet className="h-8 w-8 text-soundcloud" />,
                        title: "Transparent",
                        description: "All transactions are recorded on the blockchain for complete transparency."
                      }
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="mx-auto bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                          {item.icon}
                        </div>
                        <h3 className="font-medium mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-8 right-8 w-64 h-64 bg-tipOrange-100 rounded-full filter blur-3xl opacity-20 z-0" />
                <div className="absolute bottom-12 left-12 w-32 h-32 bg-soundcloud rounded-full filter blur-3xl opacity-10 z-0" />
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <span className="inline-block bg-soundcloud/10 text-soundcloud px-4 py-1 rounded-full text-sm font-medium mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                How TipCloud Works
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                TipCloud makes it easy to support your favorite SoundCloud DJs in just a few steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
              {[
                {
                  step: "01",
                  title: "Browse DJs",
                  description: "Discover new and talented SoundCloud DJs across various genres."
                },
                {
                  step: "02",
                  title: "Connect Wallet",
                  description: "Connect your sBTC-compatible wallet securely to the platform."
                },
                {
                  step: "03",
                  title: "Send Tips",
                  description: "Send tips of any size directly to DJs to support their work."
                }
              ].map((item, index) => (
                <div key={index} className="relative p-6 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-soundcloud text-white rounded-full flex items-center justify-center font-medium">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-medium mt-4 mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/dj/featured">
                <Button className="bg-soundcloud hover:bg-soundcloud-dark text-white px-8">
                  Discover DJs
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* sBTC Section */}
        <section className="py-16 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-soundcloud/10 text-soundcloud px-4 py-1 rounded-full text-sm font-medium mb-4">
                  Powered by Stacks
                </span>
                <h2 className="text-3xl font-display font-bold mb-6">
                  Bitcoin Micropayments Made Simple
                </h2>
                <p className="text-muted-foreground mb-4">
                  sBTC brings the power of Bitcoin to TipCloud, enabling fast, low-cost 
                  micropayments that are perfect for tipping your favorite SoundCloud DJs.
                </p>
                <p className="text-muted-foreground mb-6">
                  With sBTC, you can send tips as small as a few sats, making it easy to 
                  show your appreciation for every track you enjoy.
                </p>
                <a 
                  href="https://bitcoin.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-soundcloud hover:text-soundcloud-dark transition-colors font-medium"
                >
                  Learn more about Bitcoin 
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
              
              <div className="glass p-8 rounded-2xl relative">
                <div className="absolute -top-6 -right-6 bg-soundcloud/10 rounded-full px-4 py-2 font-medium text-soundcloud">
                  sBTC
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium mb-2">Fast Transactions</h4>
                    <p className="text-sm text-muted-foreground">
                    sBTC enables near-instant payments, so your support reaches artists immediately.
                    </p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium mb-2">Low Fees</h4>
                    <p className="text-sm text-muted-foreground">
                      Minimal transaction fees mean more of your tip goes directly to the artist.
                    </p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium mb-2">Secure</h4>
                    <p className="text-sm text-muted-foreground">
                      Bitcoin's security ensures your transactions are safe and immutable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Support Your Favorite DJs?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl mb-8">
              Join TipCloud today and start supporting the SoundCloud DJs who create the music you love.
              Your support makes a real difference in their ability to continue creating amazing tracks.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/dj/featured">
                <Button 
                  className="w-full sm:w-auto bg-soundcloud hover:bg-soundcloud-dark text-white px-8 py-6"
                  size="lg"
                >
                  Discover DJs
                </Button>
              </Link>
              <Link to="/connect">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6"
                  size="lg"
                >
                  Connect Wallet
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
