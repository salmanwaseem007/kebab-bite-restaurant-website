import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const CONSENT_KEY = 'kebab-bite-cookie-consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5">
      <div className="container mx-auto max-w-xl px-4 pb-4">
        <div className="rounded-lg border border-border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <p className="text-sm leading-relaxed text-foreground">
                {t('cookie.message')}{' '}
                <Link to="/privacy" className="font-medium underline underline-offset-4 hover:text-primary">
                  {t('cookie.learnMore')}
                </Link>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAccept} size="sm" className="h-8 text-xs">
                  {t('cookie.accept')}
                </Button>
                <Button onClick={handleDecline} variant="outline" size="sm" className="h-8 text-xs">
                  {t('cookie.decline')}
                </Button>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={t('cookie.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

