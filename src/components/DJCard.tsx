import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

interface DirectDJCardProps {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
  genre: string;
  featured?: boolean;
}

// Props that accept either a DJ object or direct props
type DJCardProps = 
  | DirectDJCardProps 
  | { dj: DJ; featured?: boolean };

// Helper to determine if props are direct or from a DJ object
const isDirectProps = (props: DJCardProps): props is DirectDJCardProps => {
  return 'id' in props && !('dj' in props);
};

const DJCard = (props: DJCardProps) => {
  // Extract values based on prop type
  const id = isDirectProps(props) ? props.id : props.dj.id;
  const name = isDirectProps(props) ? props.name : props.dj.name;
  const imageUrl = isDirectProps(props) ? props.imageUrl : (props.dj.image_url || '');
  const followers = isDirectProps(props) ? props.followers : (props.dj.followers || 0);
  const genre = isDirectProps(props) ? props.genre : props.dj.genre;
  const featured = 'featured' in props ? props.featured : false;

  const [isHovered, setIsHovered] = useState(false);
  
  const formattedFollowers = followers >= 1000 
    ? `${(followers / 1000).toFixed(1)}K` 
    : followers.toString();
    
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: `Check out ${name} on TipTune`,
        text: `Support ${name}, a talented DJ on TipTune!`,
        url: `${window.location.origin}/dj/${id}`,
      }).catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/dj/${id}`);
      toast.success("Link copied to clipboard!");
    }
  };
  
  return (
    <Link to={`/dj/${id}`}>
      <div 
        className={`group relative overflow-hidden rounded-2xl shadow-medium transition-all duration-500 ease-out
          ${featured ? 'aspect-[3/4]' : 'aspect-square'} card-hover
          hover:shadow-glow`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-gray-200 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out
              ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
        
        {/* Badge for Featured DJs */}
        {featured && (
          <div className="absolute top-4 left-4 bg-soundcloud/90 text-white text-xs font-medium px-3 py-1 rounded-full">
            Featured
          </div>
        )}
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center mb-2">
            <Users size={16} className="mr-1" />
            <span className="text-xs">{formattedFollowers} followers</span>
            <span className="mx-2 text-white/40">•</span>
            <span className="text-xs">{genre}</span>
          </div>
          <h3 className="font-display font-bold text-xl mb-3 tracking-tight">
            {name}
          </h3>
          
          <div className="flex items-center justify-between">
            <Button 
              className="text-white bg-soundcloud hover:bg-soundcloud-light rounded-full px-4 py-1 h-9
                transition-all duration-300 ease-out transform group-hover:translate-y-0"
            >
              Tip DJ
            </Button>
            
            <div className="flex space-x-2">
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Heart size={16} className="text-white" />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Share2 size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DJCard;
