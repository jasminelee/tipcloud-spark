import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Headphones, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface DJCardProps {
  dj: {
    id: string;
    name: string;
    genre: string;
    bio: string;
    soundcloud_url: string;
    image_url?: string;
    followers?: number;
    created_at: string;
  };
}

const DJCard: React.FC<DJCardProps> = ({ dj }) => {
  // Truncate bio if it's too long
  const truncateBio = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Format the "joined" date
  const formatJoinDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  // Default image if none is provided
  const defaultImage = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
        <img 
          src={dj.image_url || defaultImage} 
          alt={dj.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
          <div>
            <h3 className="text-white font-bold text-xl">{dj.name}</h3>
            <span className="text-white/80 text-sm">{dj.genre}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 text-white rounded-full px-2 py-1">
            <Headphones size={14} />
            <span className="text-xs font-medium">{dj.followers?.toLocaleString() || '0'}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-muted-foreground text-sm mb-4">
          {truncateBio(dj.bio)}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Joined {formatJoinDate(dj.created_at)}
          </span>
          
          <div className="flex gap-2">
            <a 
              href={dj.soundcloud_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-soundcloud hover:text-soundcloud-dark"
            >
              <ExternalLink size={18} />
            </a>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:text-red-500 h-8 w-8 p-0"
            >
              <Heart size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 flex">
        <Link 
          to={`/dj/${dj.id}`} 
          className="w-full"
        >
          <Button 
            variant="outline" 
            className="w-full hover:bg-soundcloud hover:text-white hover:border-soundcloud"
          >
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DJCard;
