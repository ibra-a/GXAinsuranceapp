import { Bell, Menu, User, Search, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AdminHeaderProps {
  logoSrc: string;
}

export function AdminHeader({ logoSrc }: AdminHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-purple-50">
              <Menu className="h-5 w-5" />
            </Button>
            <img src={logoSrc} alt="GXA Assurances" className="h-9 sm:h-12" />
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hidden sm:flex">
              Admin
            </Badge>
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims, users, or claim IDs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Settings */}
            <Button variant="ghost" size="icon" className="hover:bg-purple-50 group">
              <Settings className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-purple-50 group">
              <Bell className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-red-500 to-red-600 border-2 border-white shadow-lg"
              >
                8
              </Badge>
            </Button>

            {/* Admin Profile */}
            <Button variant="ghost" className="gap-2 sm:gap-3 hover:bg-purple-50 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">Claims Manager</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
