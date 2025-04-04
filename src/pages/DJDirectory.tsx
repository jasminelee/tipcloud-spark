import React, { useState, useEffect } from 'react';
import { Search, Filter, Music, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DJCard from '@/components/DJCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data to use as fallback if no Supabase data is available
const mockDJs = [
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
  },
  {
    id: "mock-5",
    name: "Bass King",
    genre: "Drum & Bass",
    bio: "Specializing in heavy bass drops and intricate drum patterns. Known for energetic live performances and unique sound design.",
    soundcloud_url: "https://soundcloud.com/bass-king",
    wallet_address: "bc1qz9x8c7v6b5n4m3a2s1d0f9g8h7j6k5l4p3o2i1",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop",
    followers: 4800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Add more mock DJs
const additionalMockDJs = [
  {
    id: "mock-6",
    name: "Vinyl Virtuoso",
    genre: "Lo-Fi",
    bio: "Creating chill beats perfect for studying or relaxing. Specializing in lo-fi hip hop with jazz influences and nostalgic vinyl scratches.",
    soundcloud_url: "https://soundcloud.com/vinyl-virtuoso",
    wallet_address: "bc1q7x6n5m4k3l2j0h9g8f7d6s5a4p3m2n1q0w9e8",
    image_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop",
    followers: 6700,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-7",
    name: "Tropical Thunder",
    genre: "Tropical House",
    bio: "Bringing the beach vibes to your speakers with uplifting tropical house tracks. Inspired by ocean waves and island getaways.",
    soundcloud_url: "https://soundcloud.com/tropical-thunder",
    wallet_address: "bc1q9w8e7r6t5y4u3i2o1p0a9s8d7f6g5h4j3k2l1",
    image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
    followers: 5200,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-8",
    name: "Midnight Groove",
    genre: "Deep House",
    bio: "Late night deep house sessions that transport you to underground clubs. Known for hypnotic beats and atmospheric soundscapes.",
    soundcloud_url: "https://soundcloud.com/midnight-groove",
    wallet_address: "bc1q2a3s4d5f6g7h8j9k0l1z2x3c4v5b6n7m8q9w0",
    image_url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop",
    followers: 7800,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-9",
    name: "Quantum Beats",
    genre: "Experimental",
    bio: "Pushing the boundaries of electronic music with innovative sound design and experimental arrangements. Expect the unexpected.",
    soundcloud_url: "https://soundcloud.com/quantum-beats",
    wallet_address: "bc1q9p8o7i6u5y4t3r2e1w0q9a8s7d6f5g4h3j2k1",
    image_url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop",
    followers: 3300,
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
    updated_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-10",
    name: "Neon Pulse",
    genre: "Synthwave",
    bio: "Retro-futuristic synthwave inspired by 80s movies and video games. Creating nostalgic electronic soundtracks for night drives.",
    soundcloud_url: "https://soundcloud.com/neon-pulse",
    wallet_address: "bc1q8k7j6h5g4f3d2s1a0p9o8i7u6y5t4r3e2w1q0",
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
    followers: 6100,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Combine all mock DJs
const allMockDJs = [...mockDJs, ...additionalMockDJs];

// Define types
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

const DJDirectory = () => {
  const [djs, setDjs] = useState<DJ[]>([]);
  const [filteredDjs, setFilteredDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'popularity'>('newest');
  
  // Get unique genres for filtering
  const genres = Array.from(new Set(djs.map(dj => dj.genre)));

  // Function to fetch DJ profiles from Supabase
  const fetchDJs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dj_profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Combine real data with mock data
        // Use a Map with id as key to avoid duplicates
        const combinedDjsMap = new Map();
        
        // Add Supabase data first
        data.forEach(dj => combinedDjsMap.set(dj.id, dj));
        
        // Then add mock data (won't override real data with same id)
        allMockDJs.forEach(dj => {
          if (!combinedDjsMap.has(dj.id)) {
            combinedDjsMap.set(dj.id, dj);
          }
        });
        
        // Convert map back to array
        setDjs(Array.from(combinedDjsMap.values()));
        console.log(`Loaded ${data.length} real DJs and ${combinedDjsMap.size - data.length} mock DJs`);
      } else {
        // Use all mock data if no real data exists
        console.log('No DJs found in database, using all mock data');
        setDjs(allMockDJs);
      }
    } catch (error) {
      console.error('Error fetching DJs:', error);
      toast.error('Failed to load DJ profiles');
      // Fallback to mock data
      setDjs(allMockDJs);
    } finally {
      setLoading(false);
    }
  };

  // Function to apply filters and sorting
  const applyFiltersAndSort = () => {
    let result = [...djs];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        dj => 
          dj.name.toLowerCase().includes(query) || 
          dj.genre.toLowerCase().includes(query) || 
          dj.bio.toLowerCase().includes(query)
      );
    }
    
    // Apply genre filter
    if (genreFilter) {
      result = result.filter(dj => dj.genre === genreFilter);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popularity':
        result.sort((a, b) => (b.followers || 0) - (a.followers || 0));
        break;
      default:
        break;
    }
    
    setFilteredDjs(result);
  };

  // Fetch DJs on component mount
  useEffect(() => {
    fetchDJs();
  }, []);
  
  // Apply filters when djs, searchQuery, genreFilter, or sortBy changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [djs, searchQuery, genreFilter, sortBy]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setGenreFilter('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Discover SoundCloud DJs</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find and support your favorite SoundCloud DJs with Bitcoin micropayments.
              Browse our community of talented artists and help them thrive.
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search by name, genre, or bio..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <Filter size={16} className="mr-2" />
                      {genreFilter || 'All Genres'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setGenreFilter('')}>
                      All Genres
                    </DropdownMenuItem>
                    {genres.map((genre) => (
                      <DropdownMenuItem 
                        key={genre}
                        onClick={() => setGenreFilter(genre)}
                      >
                        {genre}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      Sort: {sortBy === 'name' ? 'Name' : sortBy === 'newest' ? 'Newest' : 'Popular'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setSortBy('newest')}>
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                      Name (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('popularity')}>
                      Popularity
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={resetFilters}
                className="md:justify-self-end"
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Results Section */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={48} className="animate-spin text-soundcloud mb-4" />
              <p className="text-muted-foreground">Loading DJs...</p>
            </div>
          ) : filteredDjs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDjs.map((dj) => (
                <DJCard key={dj.id} dj={dj} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Music size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No DJs Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any DJs matching your search criteria.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Reset Filters
              </Button>
            </div>
          )}
          
          {/* Promotion for DJs */}
          <div className="mt-16 bg-gradient-to-r from-soundcloud/10 to-purple-100 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Are You a SoundCloud DJ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Join our community and start receiving Bitcoin tips from your fans.
              It's easy to set up and completely free.
            </p>
            <Button 
              className="bg-soundcloud hover:bg-soundcloud-dark text-white"
              onClick={() => window.location.href = '/register-dj'}
            >
              Become a DJ
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DJDirectory; 