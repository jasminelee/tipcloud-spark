import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import DJCard from './DJCard';
import { Button } from './ui/button';

// Mock data for featured DJs - using the updated format
const MOCK_FEATURED_DJS = [
  {
    id: "mock-1",
    name: "Melodic Master",
    genre: "House",
    image_url: "https://images.unsplash.com/photo-1571741140674-8949ca7df2a7?q=80&w=1000&auto=format&fit=crop",
    followers: 42500,
  },
  {
    id: "mock-2",
    name: "Beat Virtuoso",
    genre: "EDM",
    image_url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
    followers: 31200,
  },
  {
    id: "mock-3",
    name: "Rhythm Alchemist",
    genre: "Techno",
    image_url: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?q=80&w=1000&auto=format&fit=crop",
    followers: 28900,
  },
  {
    id: "mock-4",
    name: "Sonic Wave",
    genre: "Trance",
    image_url: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000&auto=format&fit=crop",
    followers: 35600,
  }
];

// Add more mock featured DJs
const ADDITIONAL_MOCK_DJS = [
  {
    id: "mock-featured-1",
    name: "DJ Astra",
    genre: "Progressive House",
    bio: "Pioneer of progressive house with ethereal soundscapes and mesmerizing melodies. Regular headliner at top electronic music festivals.",
    soundcloud_url: "https://soundcloud.com/dj-astra",
    wallet_address: "bc1q6n5m4k3l2j0h9g8f7d6s5a4p3m2z1x0c9v8b",
    image_url: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?q=80&w=1000&auto=format&fit=crop",
    followers: 12500,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-featured-2",
    name: "Bass Prophet",
    genre: "Dubstep",
    bio: "The future of dubstep is here. Known for earth-shaking bass drops and innovative sound design that pushes the boundaries of electronic music.",
    soundcloud_url: "https://soundcloud.com/bass-prophet",
    wallet_address: "bc1q7n6m5k4j3h2g1f0d9s8a7p6l5r4e3w2q1t0y",
    image_url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
    followers: 18700,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-featured-3",
    name: "Vinyl Queen",
    genre: "Classic House",
    bio: "Keeping the classic house sound alive with vinyl-only sets and infectious grooves. Bringing the authentic underground club experience to every performance.",
    soundcloud_url: "https://soundcloud.com/vinyl-queen",
    wallet_address: "bc1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l",
    image_url: "https://images.unsplash.com/photo-1583265627959-fb7042f5133b?q=80&w=1974&auto=format&fit=crop",
    followers: 15900,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Combine all mock featured DJs
const ALL_MOCK_FEATURED_DJS = [...MOCK_FEATURED_DJS, ...ADDITIONAL_MOCK_DJS];

interface DJ {
  id: string;
  name: string;
  genre: string;
  image_url?: string;
  followers?: number;
  bio?: string;
  soundcloud_url?: string;
  wallet_address?: string;
  created_at?: string;
  updated_at?: string;
}

const FeaturedDJs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredDjs, setFeaturedDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured DJs from Supabase
  const fetchFeaturedDJs = async () => {
    setLoading(true);
    try {
      // Try to fetch from Supabase (limit to 4 DJs, ordered by followers)
      const { data, error } = await supabase
        .from('dj_profiles')
        .select('*')
        .order('followers', { ascending: false })
        .limit(4);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // If we have fewer than 4 DJs from the database, fill in the remaining slots with mock DJs
        if (data.length < 4) {
          const numMockDjsNeeded = 4 - data.length;
          const mockDjsToAdd = MOCK_FEATURED_DJS.slice(0, numMockDjsNeeded);
          
          setFeaturedDjs([...data, ...mockDjsToAdd]);
        } else {
          setFeaturedDjs(data);
        }
      } else {
        console.log('No featured DJs found, using mock data');
        setFeaturedDjs(MOCK_FEATURED_DJS);
      }
    } catch (error) {
      console.error('Error fetching featured DJs:', error);
      setFeaturedDjs(MOCK_FEATURED_DJS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    fetchFeaturedDJs();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="py-16" id="featured-djs">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-sm font-medium text-soundcloud bg-soundcloud/10 px-3 py-1 rounded-full">
              Discover
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
              Featured DJs
            </h2>
          </div>
          <Link 
            to="/dj/featured" 
            className="text-soundcloud hover:text-soundcloud-dark font-medium transition-colors"
          >
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={40} className="animate-spin text-soundcloud mb-3" />
            <p className="text-muted-foreground">Loading featured DJs...</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transform transition-opacity duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            {featuredDjs.map((dj, index) => (
              <div 
                key={dj.id} 
                className="transform transition-all duration-700 ease-out"
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <DJCard
                  id={dj.id}
                  name={dj.name}
                  imageUrl={dj.image_url || ""}
                  followers={dj.followers || 0}
                  genre={dj.genre}
                  featured={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDJs;
