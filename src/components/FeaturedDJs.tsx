
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DJCard from './DJCard';

// Sample data for featured DJs
const FEATURED_DJS = [
  {
    id: "dj1",
    name: "Melodic Master",
    imageUrl: "https://images.unsplash.com/photo-1571741140674-8949ca7df2a7?q=80&w=1000&auto=format&fit=crop",
    followers: 42500,
    genre: "House"
  },
  {
    id: "dj2",
    name: "Beat Virtuoso",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
    followers: 31200,
    genre: "EDM"
  },
  {
    id: "dj3",
    name: "Rhythm Alchemist",
    imageUrl: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?q=80&w=1000&auto=format&fit=crop",
    followers: 28900,
    genre: "Techno"
  },
  {
    id: "dj4",
    name: "Sonic Wave",
    imageUrl: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000&auto=format&fit=crop",
    followers: 35600,
    genre: "Trance"
  }
];

const FeaturedDJs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="py-16">
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
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transform transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {FEATURED_DJS.map((dj, index) => (
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
                imageUrl={dj.imageUrl}
                followers={dj.followers}
                genre={dj.genre}
                featured={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDJs;
