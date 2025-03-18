
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <AnimatedLogo className="mb-4" />
            <p className="text-muted-foreground max-w-md">
              TipCloud connects SoundCloud DJs with their fans through sBTC micropayments,
              making it easy to support your favorite artists directly.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com" className="text-muted-foreground hover:text-soundcloud transition-colors" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-soundcloud transition-colors" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="mailto:info@TipCloud.com" className="text-muted-foreground hover:text-soundcloud transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Navigate</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-soundcloud transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dj/featured" className="text-muted-foreground hover:text-soundcloud transition-colors">
                  Featured DJs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-soundcloud transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-soundcloud transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-soundcloud transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TipCloud. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Powered by Stacks Connect
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
