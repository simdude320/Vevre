
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Home, 
  Search, 
  PlusCircle, 
  Mail, 
  User as UserIcon,
  Settings,
  Sun,
  Moon,
  Monitor,
  Bell
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Feed"),
    icon: Home
  },
  {
    title: "Discover",
    url: createPageUrl("Search"),
    icon: Search
  },
  {
    title: "Create",
    url: createPageUrl("Create"),
    icon: PlusCircle
  },
  {
    title: "Messages",
    url: createPageUrl("Messages"),
    icon: Mail
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    loadUser();
    loadTheme();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      setTheme(user.theme_preference || 'system');
    } catch (error) {
      console.error("User not authenticated");
    }
  };

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  };

  const applyTheme = (newTheme) => {
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    
    if (currentUser) {
      await User.updateMyUserData({ theme_preference: newTheme });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <style jsx>{`
        :root {
          --color-primary: 99 102 241;
          --color-primary-foreground: 255 255 255;
        }
        
        .dark {
          --color-background: 15 23 42;
          --color-foreground: 248 250 252;
          --color-card: 30 41 59;
          --color-border: 51 65 85;
        }
      `}</style>

      {/* Desktop Header */}
      <div className="hidden lg:block sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to={createPageUrl("Feed")} className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">SocialConnect</span>
              </Link>
              
              <nav className="flex space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.url
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 text-[10px] flex items-center justify-center">
                  3
                </Badge>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light mode
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark mode
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeTheme('system')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {currentUser && (
                <Link to={createPageUrl("Profile")}>
                  <Avatar className="w-8 h-8 ring-2 ring-indigo-200 dark:ring-indigo-800">
                    <AvatarImage src={currentUser.profile_picture_url} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                      {currentUser.username?.[0]?.toUpperCase() || currentUser.full_name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to={createPageUrl("Feed")} className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">SocialConnect</span>
          </Link>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="relative w-9 h-9">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 bg-red-500 text-[9px] flex items-center justify-center border-2 border-white dark:border-slate-900">
                3
              </Badge>
            </Button>
            
            {currentUser && (
              <Link to={createPageUrl("Profile")}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.profile_picture_url} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                    {currentUser.username?.[0]?.toUpperCase() || currentUser.full_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 z-50">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center justify-center h-full w-full transition-all duration-200 rounded-lg ${
                location.pathname === item.url
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[11px] mt-1 font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 lg:pb-6">
        {children}
      </main>
    </div>
  );
}
