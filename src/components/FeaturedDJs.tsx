import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import DJCard from './DJCard';
import { Button } from './ui/button';

// Mock data for featured DJs
const MOCK_FEATURED_DJS = [
  {
    id: "mock-1",
    name: "DJ Rhythmic",
    genre: "House",
    bio: "Bringing the best house beats from NYC to the world. Over 10 years of experience making crowds dance.",
    soundcloud_url: "https://soundcloud.com/dj-rhythmic",
    wallet_address: "bc1q9h5yx4nv8heqkahmzz2jmkxvs0f3m7x2z9v7rr",
    image_url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070&auto=format&fit=crop",
    followers: 4200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    name: "Mixmaster Flow",
    genre: "Hip Hop",
    bio: "Turntablist and producer specializing in hip hop and R&B mixes. Featured on major radio stations across the country.",
    soundcloud_url: "https://soundcloud.com/mixmaster-flow",
    wallet_address: "bc1q8c6t7v3s4r5e6f7g8h9j0k1l2m3n4o5p6q7r8s",
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
    followers: 2800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-3",
    name: "Electra Beats",
    genre: "Techno",
    bio: "Berlin-based techno producer pushing the boundaries of electronic music. Performing at major festivals worldwide.",
    soundcloud_url: "https://soundcloud.com/electra-beats",
    wallet_address: "bc1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0",
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop",
    followers: 5600,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-4",
    name: "Melody Maker",
    genre: "Trance",
    bio: "Creating uplifting trance music that takes listeners on a journey. Regular appearances at clubs across Europe and Asia.",
    soundcloud_url: "https://soundcloud.com/melody-maker",
    wallet_address: "bc1qa2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0",
    image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
    followers: 3900,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
  bio: string;
  soundcloud_url: string;
  wallet_address: string;
  image_url?: string;
  followers?: number;
  created_at: string;
  updated_at: string;
}

const FeaturedDJs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredDjs, setFeaturedDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured DJs from Supabase
  const fetchFeaturedDJs = async () => {
    setLoading(true);
    try {
      // Try to fetch from Supabase (limit to 4-8 DJs, ordered by followers)
      const { data, error } = await supabase
        .from('dj_profiles')
        .select('*')
        .order('followers', { ascending: false })
        .limit(8);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // If we have real data, mix it with some mock data to ensure variety
        // Use a Map to avoid duplicates
        const combinedDjsMap = new Map();
        
        // Add real data first
        data.forEach(dj => combinedDjsMap.set(dj.id, dj));
        
        // If we have fewer than 8 real DJs, add some mock ones
        if (data.length < 8) {
          // Add mock DJs until we reach 8 total
          let mockAdded = 0;
          for (const mockDj of ALL_MOCK_FEATURED_DJS) {
            if (!combinedDjsMap.has(mockDj.id)) {
              combinedDjsMap.set(mockDj.id, mockDj);
              mockAdded++;
              if (combinedDjsMap.size >= 8) break; // Stop once we have 8 total
            }
          }
          console.log(`Added ${mockAdded} mock featured DJs to ${data.length} real DJs`);
        }
        
        // Convert map to array and limit to 8
        const combinedDjs = Array.from(combinedDjsMap.values());
        
        // Sort by followers (descending)
        combinedDjs.sort((a, b) => (b.followers || 0) - (a.followers || 0));
        
        // Use up to 8 DJs
        setFeaturedDjs(combinedDjs.slice(0, 8));
      } else {
        console.log('No featured DJs found, using all mock data');
        // If we have no real data, use all mock data (up to 8)
        setFeaturedDjs(ALL_MOCK_FEATURED_DJS.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching featured DJs:', error);
      // Fallback to mock data
      setFeaturedDjs(ALL_MOCK_FEATURED_DJS.slice(0, 8));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Animation delay
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Fetch data
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
            className="text-soundcloud hover:text-soundcloud-dark font-medium transition-colors flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={40} className="animate-spin text-soundcloud mb-3" />
            <p className="text-muted-foreground">Loading featured DJs...</p>
          </div>
        ) : (
          <div className={`transform transition-opacity duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* First row - first 4 DJs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
              {featuredDjs.slice(0, 4).map((dj, index) => (
                <div 
                  key={dj.id} 
                  className="transform transition-all duration-700 ease-out"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <DJCard dj={dj} />
                </div>
              ))}
            </div>
            
            {/* Second row - next 4 DJs (if present) */}
            {featuredDjs.length > 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {featuredDjs.slice(4, 8).map((dj, index) => (
                  <div 
                    key={dj.id} 
                    className="transform transition-all duration-700 ease-out"
                    style={{ 
                      transitionDelay: `${(index + 4) * 100}ms`,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <DJCard dj={dj} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            className="border-2 border-soundcloud hover:bg-soundcloud/10 text-soundcloud font-medium px-6 py-2 rounded-full"
            onClick={() => window.location.href = '/dj/featured'}
          >
            Browse All DJs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDJs;
