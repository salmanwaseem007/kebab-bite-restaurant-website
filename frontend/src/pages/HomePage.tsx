import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { useGetContactInfo } from '@/hooks/useQueries';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';

export default function HomePage() {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const { t } = useLanguage();

  // Set page-specific meta tags
  useEffect(() => {
    // Update title
    document.title = 'Mejores Kebabs en Ronda | Kebabbite';
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Disfruta de deliciosos kebabs de pollo, cordero ternera en Kebabbite Ronda. Ordena online para entrega o para llevar.');
    }
    
    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'kebabs Ronda, mejores kebabs Ronda, kebabs a la parrilla Ronda, kebab de pollo Ronda, kebab de cordero Ronda, kebab de ternera Ronda, shawarma Ronda, kebabs para llevar Ronda, rollo kebab Ronda, kebab en pan Ronda, pizza turca Ronda, patatas Ronda, alitas Ronda, nuggets Ronda, pizzas Ronda, rollo Ronda, ensalada Ronda, hamburguesas Ronda, bebida Ronda');
    }
    
    // Update canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', 'https://kebabbite.com/');
    }
  }, []);

  // Add Restaurant structured data (JSON-LD) for SEO
  useEffect(() => {
    // Remove any existing structured data script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create structured data object
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "Kebabbite",
      "url": "https://kebabbite.com",
      "telephone": "+34 614 55 18 97",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C. el Niño, 4",
        "addressLocality": "Ronda",
        "postalCode": "29400",
        "addressRegion": "Málaga",
        "addressCountry": "ES"
      },
      "servesCuisine": ["Kebabs", "Middle Eastern", "Fast Food"],
      "menu": "https://kebabbite.com/menu",
      "acceptsReservations": true,
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "13:00",
          "closes": "16:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "19:00",
          "closes": "00:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday", "Saturday", "Sunday"],
          "opens": "13:00",
          "closes": "16:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday", "Saturday", "Sunday"],
          "opens": "19:00",
          "closes": "01:00"
        }
      ],
      "hasMenu": {
        "@type": "Menu",
        "hasMenuSection": [
          {
            "@type": "MenuSection",
            "name": "Kebabs",
            "hasMenuItem": [
              {
                "@type": "MenuItem",
                "name": "Chicken Kebab",
                "description": "Delicioso kebab de pollo"
              },
              {
                "@type": "MenuItem",
                "name": "Lamb Kebab",
                "description": "Sabroso kebab de cordero"
              },
              {
                "@type": "MenuItem",
                "name": "Beef Kebab",
                "description": "Jugoso kebab de ternera"
              },
              {
                "@type": "MenuItem",
                "name": "Rollo Kebab",
                "description": "Rollo kebab tradicional"
              },
              {
                "@type": "MenuItem",
                "name": "Kebab en Pan",
                "description": "Kebab servido en pan"
              }
            ]
          },
          {
            "@type": "MenuSection",
            "name": "Especialidades",
            "hasMenuItem": [
              {
                "@type": "MenuItem",
                "name": "Pizza Turca",
                "description": "Auténtica pizza turca"
              },
              {
                "@type": "MenuItem",
                "name": "Patatas",
                "description": "Patatas fritas crujientes"
              },
              {
                "@type": "MenuItem",
                "name": "Alitas",
                "description": "Alitas de pollo"
              },
              {
                "@type": "MenuItem",
                "name": "Nuggets",
                "description": "Nuggets de pollo"
              }
            ]
          },
          {
            "@type": "MenuSection",
            "name": "Otros Platos",
            "hasMenuItem": [
              {
                "@type": "MenuItem",
                "name": "Pizzas",
                "description": "Variedad de pizzas"
              },
              {
                "@type": "MenuItem",
                "name": "Rollo",
                "description": "Rollo especial"
              },
              {
                "@type": "MenuItem",
                "name": "Ensalada",
                "description": "Ensalada fresca"
              },
              {
                "@type": "MenuItem",
                "name": "Hamburguesas",
                "description": "Hamburguesas jugosas"
              },
              {
                "@type": "MenuItem",
                "name": "Bebida",
                "description": "Variedad de bebidas"
              }
            ]
          }
        ]
      }
    };

    // Create and inject script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  // Format WhatsApp number for URL (remove spaces, dashes, etc.)
  const formatWhatsAppNumber = (phone: string) => {
    return phone.replace(/\s+/g, '').replace(/-/g, '');
  };

  const whatsappUrl = contactInfo
    ? `https://wa.me/${formatWhatsAppNumber(contactInfo.whatsapp)}`
    : '#';

  const directionsUrl = contactInfo
    ? `https://www.google.com/maps/dir/?api=1&destination=${contactInfo.latitude},${contactInfo.longitude}`
    : '#';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/Px2aMqz.png"
            alt="Deliciosos kebabs mediterráneos"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative mx-auto flex h-full max-w-7xl items-center px-4">
          <div className="max-w-2xl space-y-6 text-white">
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl">
              {t('home.subtitle')}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              contactInfo && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-lg hover:text-primary transition-colors"
                >
                  <SiWhatsapp className="h-5 w-5" />
                  <span>{contactInfo.whatsapp}</span>
                </a>
              )
            )}
            <div>
              <Button asChild size="lg" className="mt-2">
                <Link to="/menu">{t('home.viewMenu')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-3xl font-bold md:text-4xl">{t('home.ourStory')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('home.storyPara1')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('home.storyPara2')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.visitUs')}</h2>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            contactInfo && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-background border border-border">
                  <MapPin className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold">{t('home.address')}</h3>
                  <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-background border border-border">
                  <Clock className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold">{t('home.hours')}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{contactInfo.openingHours}</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-background border border-border">
                  <Mail className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold">{t('home.email')}</h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-background border border-border">
                  <Phone className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold">{t('home.phone')}</h3>
                  <a
                    href={`tel:${contactInfo.whatsapp}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {contactInfo.whatsapp}
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{t('home.findUs')}</h2>
          {isLoading ? (
            <Skeleton className="w-full h-64 rounded" />
          ) : (
            contactInfo && (
              <div className="space-y-4">
                <iframe
                  title={t('contact.mapTitle')}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${contactInfo.latitude},${contactInfo.longitude}&zoom=15`}
                  className="w-full h-64 rounded border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex justify-center">
                  <Button asChild>
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                      {t('home.getDirections')}
                    </a>
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      {contactInfo && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
          aria-label={t('home.whatsappAria')}
        >
          <SiWhatsapp className="h-7 w-7" />
        </a>
      )}
    </div>
  );
}

