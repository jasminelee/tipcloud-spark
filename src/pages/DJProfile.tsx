
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Music, Users, Calendar, MapPin, ExternalLink, Share2, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TipModal from '@/components/TipModal';

// Sample DJ data
const DJS = {
  "dj1": {
    id: "dj1",
    name: "Melodic Master",
    imageUrl: "https://images.unsplash.com/photo-1571741140674-8949ca7df2a7?q=80&w=1000&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2000&auto=format&fit=crop",
    followers: 42500,
    genre: "House",
    location: "Berlin, Germany",
    bio: "Pioneering the house music scene since 2015, Melodic Master creates immersive soundscapes that take listeners on a journey through rhythm and melody.",
    soundcloudUrl: "https://soundcloud.com/melodicmaster",
    walletAddress: "bc1q3x5c7v8m6q9s2rsete4sf2g5w6x5v0a3k5",
    joinedDate: "2015-04-12",
    tracks: [
      { id: "t1", title: "Summer Waves", plays: 124500 },
      { id: "t2", title: "Midnight Groove", plays: 98700 },
      { id: "t3", title: "Electric Dreams", plays: 156200 },
    ]
  },
  "dj2": {
    id: "dj2",
    name: "Beat Virtuoso",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2000&auto=format&fit=crop",
    followers: 31200,
    genre: "EDM",
    location: "Los Angeles, USA",
    bio: "Beat Virtuoso pushes the boundaries of EDM with innovative drops and melodic hooks that energize dance floors worldwide.",
    soundcloudUrl: "https://soundcloud.com/beatvirtuoso",
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    joinedDate: "2017-08-25",
    tracks: [
      { id: "t4", title: "Neon Lights", plays: 87300 },
      { id: "t5", title: "Pulse", plays: 102400 },
      { id: "t6", title: "Energy Surge", plays: 94600 },
    ]
  },
  "dj3": {
    id: "dj3",
    name: "Rhythm Alchemist",
    imageUrl: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?q=80&w=1000&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2000&auto=format&fit=crop",
    followers: 28900,
    genre: "Techno",
    location: "Detroit, USA",
    bio: "Rhythm Alchemist transforms raw techno elements into gold, crafting hypnotic beats that captivate audiences in clubs around the world.",
    soundcloudUrl: "https://soundcloud.com/rhythmalchemist",
    walletAddress: "bc1q9h2xmp0psr6mzm5pqwuy4qmsj4g9jy52vuj7aj",
    joinedDate: "2016-02-10",
    tracks: [
      { id: "t7", title: "Warehouse", plays: 76800 },
      { id: "t8", title: "Machine Code", plays: 83500 },
      { id: "t9", title: "Industrial Complex", plays: 91200 },
    ]
  },
  "dj4": {
    id: "dj4",
    name: "Sonic Wave",
    imageUrl: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2000&auto=format&fit=crop",
    followers: 35600,
    genre: "Trance",
    location: "Amsterdam, Netherlands",
    bio: "Sonic Wave creates ethereal trance compositions that transport listeners to other dimensions with atmospheric sounds and driving rhythms.",
    soundcloudUrl: "https://soundcloud.com/sonicwave",
    walletAddress: "bc1qm5th5azmjq3lkrm98shsdt8xr4j92m0w5all8l",
    joinedDate: "2014-11-05",
    tracks: [
      { id: "t10", title: "Cosmic Journey", plays: 115700 },
      { id: "t11", title: "Astral Projection", plays: 128300 },
      { id: "t12", title: "Event Horizon", plays: 143900 },
    ]
  }
};

const DJProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [dj, setDj] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tracks");
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      if (id && DJS[id as keyof typeof DJS]) {
        setDj(DJS[id as keyof typeof DJS]);
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out ${dj?.name} on TipTune`,
        text: `Support ${dj?.name}, a talented SoundCloud DJ on TipTune!`,
        url: window.location.href,
      }).catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 border-4 border-t-soundcloud rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading DJ profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!dj) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">DJ Not Found</h2>
            <p className="text-muted-foreground mb-6">The DJ you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-soundcloud text-white hover:bg-soundcloud-dark"
            >
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long'
    }).format(date);
  };
  
  const formatPlays = (plays: number) => {
    return plays >= 1000 
      ? `${(plays / 1000).toFixed(1)}K plays` 
      : `${plays} plays`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/30"></div>
          <img 
            src={dj.coverUrl} 
            alt={`${dj.name} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Profile Header */}
          <div className="relative -mt-20 mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-background shadow-lg">
                <img 
                  src={dj.imageUrl} 
                  alt={dj.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 md:pt-6">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="text-3xl md:text-4xl font-display font-bold">{dj.name}</h1>
                  <div className="md:ml-4 mt-2 md:mt-0">
                    <span className="inline-block bg-soundcloud/10 text-soundcloud px-3 py-1 rounded-full text-sm font-medium">
                      {dj.genre}
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <Users size={16} className="mr-1" />
                  <span className="text-sm">{dj.followers.toLocaleString()} followers</span>
                  <span className="mx-2">•</span>
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{dj.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button 
                className="bg-soundcloud hover:bg-soundcloud-dark text-white"
                onClick={() => setTipModalOpen(true)}
              >
                <HandCoins size={18} className="mr-2" />
                Tip DJ
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
              <a href={dj.soundcloudUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink size={18} className="mr-2" />
                  SoundCloud
                </Button>
              </a>
            </div>
          </div>
          
          {/* Bio & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-medium mb-3">Bio</h2>
              <p className="text-muted-foreground">{dj.bio}</p>
              
              <div className="flex items-center mt-6 text-sm text-muted-foreground">
                <Calendar size={16} className="mr-2" />
                <span>Joined {formatDate(dj.joinedDate)}</span>
              </div>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h2 className="text-xl font-medium mb-4">Support {dj.name}</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your tips help {dj.name} continue creating the music you love. 
                Support directly with SBTC.
              </p>
              <Button 
                className="w-full bg-soundcloud hover:bg-soundcloud-dark text-white"
                onClick={() => setTipModalOpen(true)}
              >
                <HandCoins size={18} className="mr-2" />
                Send Tip
              </Button>
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
            <TabsList>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tracks" className="mt-6">
              <div className="space-y-4">
                {dj.tracks.map((track: any) => (
                  <div 
                    key={track.id}
                    className="group flex items-center p-4 bg-secondary/40 hover:bg-secondary/80 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                      <Music size={24} className="text-muted-foreground group-hover:text-soundcloud transition-colors" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium group-hover:text-soundcloud transition-colors">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{formatPlays(track.plays)}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setTipModalOpen(true)}
                    >
                      <HandCoins size={18} className="text-soundcloud" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">More About {dj.name}</h3>
                  <p className="text-muted-foreground">{dj.bio}</p>
                  <p className="text-muted-foreground mt-4">
                    Based in {dj.location}, {dj.name} has been creating and performing {dj.genre} music
                    since {formatDate(dj.joinedDate)}.
                  </p>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-medium mb-4">Connect</h3>
                  <div className="space-y-4">
                    <a 
                      href={dj.soundcloudUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-muted-foreground hover:text-soundcloud transition-colors"
                    >
                      <Music size={18} className="mr-2" />
                      SoundCloud
                    </a>
                    <button
                      onClick={handleShare}
                      className="flex items-center text-muted-foreground hover:text-soundcloud transition-colors"
                    >
                      <Share2 size={18} className="mr-2" />
                      Share Profile
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      <TipModal
        open={tipModalOpen}
        onOpenChange={setTipModalOpen}
        djName={dj.name}
        djImageUrl={dj.imageUrl}
        djWalletAddress={dj.walletAddress}
      />
    </div>
  );
};

export default DJProfile;
