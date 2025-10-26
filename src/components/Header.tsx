import { Bell, Menu, User, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  logoSrc: string;
}

export function Header({ logoSrc }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-blue-50">
              <Menu className="h-5 w-5" />
            </Button>
            <img src={logoSrc} alt="GXA Assurances" className="h-9 sm:h-12" />
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon - Mobile only */}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 group">
              <Bell className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-red-500 to-red-600 border-2 border-white shadow-lg"
              >
                3
              </Badge>
            </Button>

            {/* User Profile */}
            <Button variant="ghost" className="gap-2 sm:gap-3 hover:bg-blue-50 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm text-gray-900">Jean Dupont</div>
                <div className="text-xs text-gray-500">Client ID: #12345</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
