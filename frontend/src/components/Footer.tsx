import { Link } from '@tanstack/react-router';
import { SiFacebook } from 'react-icons/si';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/" className="transition-colors hover:text-primary">
              {t('nav.home')}
            </Link>
            <Link to="/menu" className="transition-colors hover:text-primary">
              {t('nav.menu')}
            </Link>
            <Link to="/contact" className="transition-colors hover:text-primary">
              {t('nav.contact')}
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-primary">
              {t('nav.privacy')}
            </Link>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-primary"
            >
              <SiFacebook className="h-4 w-4" />
              <span>Facebook</span>
            </a>
          </nav>
          <p className="text-sm text-muted-foreground">
            © 2025. {t('footer.builtWith')} <Heart className="inline h-4 w-4 fill-red-500 text-red-500" /> {t('footer.using')}{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

