import { useGetContactInfo } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';

export default function ContactPage() {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const [mapError, setMapError] = useState(false);
  const { t } = useLanguage();

  const getDirectionsUrl = () => {
    if (!contactInfo) return '#';
    return `https://www.google.com/maps/dir/?api=1&destination=${contactInfo.latitude},${contactInfo.longitude}`;
  };

  const getWhatsAppUrl = () => {
    if (!contactInfo) return '#';
    return `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`;
  };

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">{t('contact.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('contact.subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            contactInfo && (
              <div className="space-y-8">
                {/* Contact Information Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <MapPin className="mt-1 h-6 w-6 shrink-0 text-primary" />
                      <div className="flex-1">
                        <h2 className="mb-2 text-lg font-semibold">{t('contact.address')}</h2>
                        <p className="text-muted-foreground">{contactInfo.address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <SiWhatsapp className="mt-1 h-6 w-6 shrink-0 text-primary" />
                      <div className="flex-1">
                        <h2 className="mb-2 text-lg font-semibold">{t('contact.whatsapp')}</h2>
                        <a
                          href={getWhatsAppUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
                        >
                          {contactInfo.whatsapp}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <Mail className="mt-1 h-6 w-6 shrink-0 text-primary" />
                      <div className="flex-1">
                        <h2 className="mb-2 text-lg font-semibold">{t('contact.email')}</h2>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <Clock className="mt-1 h-6 w-6 shrink-0 text-primary" />
                      <div className="flex-1">
                        <h2 className="mb-2 text-lg font-semibold">{t('contact.hours')}</h2>
                        <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
                          {contactInfo.openingHours}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Map Section */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">{t('contact.findUs')}</h2>
                  
                  {mapError ? (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <MapPin className="mt-1 h-6 w-6 shrink-0 text-primary" />
                          <div className="flex-1">
                            <h3 className="mb-2 text-lg font-semibold">{t('contact.location')}</h3>
                            <p className="mb-2 text-muted-foreground">{contactInfo.address}</p>
                            <p className="text-sm text-muted-foreground">
                              {t('contact.coordinates')}: {contactInfo.latitude}, {contactInfo.longitude}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="mt-4 h-64 w-full overflow-hidden rounded">
                      <iframe
                        src={`https://www.google.com/maps?q=${contactInfo.latitude},${contactInfo.longitude}&hl=en&z=15&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={t('contact.mapTitle')}
                        onError={() => setMapError(true)}
                      />
                    </div>
                  )}

                  <div className="flex justify-center">
                    <Button asChild size="lg">
                      <a
                        href={getDirectionsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        {t('contact.getDirections')}
                      </a>
                    </Button>
                  </div>
                </section>
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
}

