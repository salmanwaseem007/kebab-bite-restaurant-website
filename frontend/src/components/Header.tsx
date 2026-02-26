import { Link } from '@tanstack/react-router';
import { Menu, X, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { language, setLanguage, t } = useLanguage();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/assets/generated/kebab-bite-logo-transparent.dim_200x200.png" alt="Kebab Bite" className="h-10 w-10" />
          <span className="text-2xl font-bold text-primary">Kebab Bite</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/menu"
            className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
          >
            {t('nav.menu')}
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
          >
            {t('nav.contact')}
          </Link>
          <Link
            to="/privacy"
            className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
          >
            {t('nav.privacy')}
          </Link>
          
          {/* Language Toggle - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" aria-label={t('lang.toggle')}>
                <Globe className="h-4 w-4" />
                <span className="hidden lg:inline">{language === 'es' ? 'ES' : 'EN'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('es')} className={language === 'es' ? 'bg-accent' : ''}>
                {t('lang.spanish')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')} className={language === 'en' ? 'bg-accent' : ''}>
                {t('lang.english')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Language Toggle - Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 px-2" aria-label={t('lang.toggle')}>
                <Globe className="h-4 w-4" />
                <span className="text-xs">{language === 'es' ? 'ES' : 'EN'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('es')} className={language === 'es' ? 'bg-accent' : ''}>
                {t('lang.spanish')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')} className={language === 'en' ? 'bg-accent' : ''}>
                {t('lang.english')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Hamburger Button */}
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="md:hidden border-b border-border bg-background animate-slideDown"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary py-2 px-3 rounded-md hover:bg-accent"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/menu"
              onClick={handleLinkClick}
              className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary py-2 px-3 rounded-md hover:bg-accent"
            >
              {t('nav.menu')}
            </Link>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary py-2 px-3 rounded-md hover:bg-accent"
            >
              {t('nav.contact')}
            </Link>
            <Link
              to="/privacy"
              onClick={handleLinkClick}
              className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary py-2 px-3 rounded-md hover:bg-accent"
            >
              {t('nav.privacy')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

