import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'kebab-bite-language';

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header
    'nav.home': 'Inicio',
    'nav.menu': 'Menú',
    'nav.contact': 'Contacto',
    'nav.privacy': 'Política de Privacidad',
    
    // Home Page
    'home.title': 'Kebab Bite',
    'home.subtitle': 'Deliciosos Shawarmas y Clásicos de Comida Callejera.',
    'home.viewMenu': 'Ver Menú',
    'home.ourStory': 'Nuestra Historia',
    'home.storyPara1': 'En Kebab Bite, nos especializamos en auténtica comida callejera mediterránea Halal. Nuestro menú incluye favoritos tradicionales como Rollo Kebab, Kebab en Pan, Kebab Turka, Alitas, Nuggets y Pizzas, todos preparados con esmero y especias auténticas.',
    'home.storyPara2': 'Ubicados en el corazón de Ronda, te invitamos a disfrutar de nuestro delicioso Döner Kebab, hamburguesas, ensaladas e ingredientes frescos que traen el sabor de las recetas tradicionales a cada plato. Vive la verdadera esencia de la comida callejera mediterránea en cada bocado.',
    'home.visitUs': 'Visítanos',
    'home.address': 'Dirección',
    'home.hours': 'Horario',
    'home.email': 'Email',
    'home.phone': 'Teléfono',
    'home.findUs': 'Encuéntranos',
    'home.getDirections': 'Cómo Llegar',
    'home.whatsappAria': 'Contáctanos por WhatsApp',
    
    // Menu Page
    'menu.title': 'Nuestro Menú',
    'menu.subtitle': 'Explora nuestra deliciosa selección de auténticos kebabs y platos mediterráneos',
    'menu.orderWhatsapp': 'Hacer Pedido por WhatsApp',
    'menu.comingSoon': 'Fotos del menú próximamente.',
    'menu.error': 'Error al cargar las fotos del menú. Por favor, inténtalo de nuevo más tarde.',
    'menu.previous': 'Imagen anterior',
    'menu.next': 'Siguiente imagen',
    'menu.closeLightbox': 'Cerrar vista ampliada',
    'menu.goToImage': 'Ir a la imagen',
    
    // Contact Page
    'contact.title': 'Ponte en Contacto',
    'contact.subtitle': 'Visítanos o contáctanos — nos encantaría saber de ti',
    'contact.address': 'Dirección',
    'contact.whatsapp': 'WhatsApp',
    'contact.email': 'Email',
    'contact.hours': 'Horario de Apertura',
    'contact.findUs': 'Encuéntranos',
    'contact.location': 'Ubicación',
    'contact.coordinates': 'Coordenadas',
    'contact.getDirections': 'Cómo Llegar',
    'contact.mapTitle': 'Ubicación del Restaurante',
    
    // Privacy Policy Page
    'privacy.title': 'Política de Privacidad',
    'privacy.intro.title': 'Introducción',
    'privacy.intro.content': 'En Kebab Bite, estamos comprometidos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información cuando visitas nuestro sitio web o utilizas nuestros servicios.',
    'privacy.collect.title': 'Información que Recopilamos',
    'privacy.collect.intro': 'Recopilamos los siguientes tipos de información:',
    'privacy.collect.usage': 'Información Básica de Uso:',
    'privacy.collect.usageDesc': 'Recopilamos información sobre cómo interactúas con nuestro sitio web, incluyendo páginas visitadas, tiempo en las páginas y patrones de navegación.',
    'privacy.collect.cookies': 'Cookies:',
    'privacy.collect.cookiesDesc': 'Utilizamos cookies funcionales para recordar tus preferencias y mejorar tu experiencia de navegación. Estas cookies nos ayudan a entender cómo los visitantes usan nuestro sitio.',
    'privacy.collect.contact': 'Información de Contacto:',
    'privacy.collect.contactDesc': 'Cuando nos contactas por WhatsApp, email u otros medios, podemos recopilar tu nombre, datos de contacto y cualquier información que elijas compartir con nosotros.',
    'privacy.purpose.title': 'Propósito de la Recopilación de Datos',
    'privacy.purpose.intro': 'Utilizamos la información recopilada para los siguientes propósitos:',
    'privacy.purpose.functional': 'Cookies Funcionales:',
    'privacy.purpose.functionalDesc': 'Para recordar tus preferencias de consentimiento de cookies y proporcionar una experiencia de navegación fluida entre visitas.',
    'privacy.purpose.analytics': 'Análisis:',
    'privacy.purpose.analyticsDesc': 'Para entender cómo los visitantes usan nuestro sitio web, lo que nos ayuda a mejorar nuestro contenido, diseño y servicios.',
    'privacy.purpose.service': 'Prestación de Servicios:',
    'privacy.purpose.serviceDesc': 'Para procesar tus pedidos, responder a consultas y proporcionar atención al cliente.',
    'privacy.purpose.communication': 'Comunicación:',
    'privacy.purpose.communicationDesc': 'Para enviarte actualizaciones sobre tus pedidos y responder a tus preguntas o comentarios.',
    'privacy.cookieMgmt.title': 'Gestión de Cookies',
    'privacy.cookieMgmt.para1': 'Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Puedes gestionar tus preferencias de cookies en cualquier momento limpiando el almacenamiento local de tu navegador o ajustando la configuración de tu navegador. Ten en cuenta que deshabilitar las cookies puede afectar la funcionalidad de ciertas características de nuestro sitio web.',
    'privacy.cookieMgmt.para2': 'Si previamente rechazaste las cookies y deseas cambiar tu preferencia, puedes limpiar el almacenamiento local de tu navegador para este sitio, y el banner de consentimiento de cookies aparecerá nuevamente en tu próxima visita.',
    'privacy.security.title': 'Seguridad de Datos',
    'privacy.security.content': 'Implementamos medidas técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por internet o almacenamiento electrónico es 100% seguro, y no podemos garantizar seguridad absoluta.',
    'privacy.rights.title': 'Tus Derechos',
    'privacy.rights.intro': 'Tienes los siguientes derechos con respecto a tu información personal:',
    'privacy.rights.access': 'Acceso:',
    'privacy.rights.accessDesc': 'Tienes derecho a solicitar acceso a la información personal que tenemos sobre ti.',
    'privacy.rights.correction': 'Corrección:',
    'privacy.rights.correctionDesc': 'Puedes solicitar que corrijamos cualquier información inexacta o incompleta.',
    'privacy.rights.deletion': 'Eliminación:',
    'privacy.rights.deletionDesc': 'Puedes solicitar que eliminemos tu información personal, sujeto a obligaciones legales.',
    'privacy.rights.consent': 'Gestión de Consentimiento:',
    'privacy.rights.consentDesc': 'Puedes retirar tu consentimiento para el uso de cookies en cualquier momento limpiando el almacenamiento local de tu navegador o ajustando la configuración de tu navegador.',
    'privacy.rights.portability': 'Portabilidad de Datos:',
    'privacy.rights.portabilityDesc': 'Tienes derecho a recibir tus datos personales en un formato estructurado y de uso común.',
    'privacy.rights.exercise': 'Para ejercer cualquiera de estos derechos, por favor contáctanos usando la información proporcionada en nuestra',
    'privacy.rights.contactPage': 'página de Contacto',
    'privacy.thirdParty.title': 'Servicios de Terceros',
    'privacy.thirdParty.content': 'Nuestro sitio web puede contener enlaces a servicios de terceros como WhatsApp, Google Maps y plataformas de redes sociales. No somos responsables de las prácticas de privacidad de estos servicios de terceros. Te animamos a revisar sus políticas de privacidad antes de proporcionar cualquier información personal.',
    'privacy.updates.title': 'Actualizaciones de Esta Política',
    'privacy.updates.content': 'Podemos actualizar esta política de privacidad de vez en cuando para reflejar cambios en nuestras prácticas o requisitos legales. Cualquier cambio se publicará en esta página con una fecha de revisión actualizada. Te animamos a revisar esta política periódicamente para mantenerte informado sobre cómo protegemos tu información.',
    'privacy.updates.lastUpdated': 'Última actualización: 28 de noviembre de 2025',
    'privacy.contactUs.title': 'Contáctanos',
    'privacy.contactUs.content': 'Si tienes alguna pregunta, inquietud o solicitud con respecto a esta Política de Privacidad o nuestras prácticas de datos, por favor contáctanos a través de nuestra',
    'privacy.contactUs.contactPage': 'página de Contacto',
    'privacy.contactUs.response': '. Responderemos a tu consulta lo antes posible.',
    
    // Cookie Consent
    'cookie.message': 'Utilizamos cookies para mejorar tu experiencia de navegación y analizar el tráfico del sitio. Al hacer clic en "Aceptar", consientes nuestro uso de cookies.',
    'cookie.learnMore': 'Más información',
    'cookie.accept': 'Aceptar',
    'cookie.decline': 'Rechazar',
    'cookie.close': 'Cerrar',
    
    // Footer
    'footer.builtWith': 'Construido con',
    'footer.using': 'usando',
    
    // Language Toggle
    'lang.spanish': 'Español',
    'lang.english': 'English',
    'lang.toggle': 'Cambiar idioma',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.contact': 'Contact',
    'nav.privacy': 'Privacy Policy',
    
    // Home Page
    'home.title': 'Kebab Bite',
    'home.subtitle': 'Delicious Shawarma & Street-Food Classics.',
    'home.viewMenu': 'View Menu',
    'home.ourStory': 'Our Story',
    'home.storyPara1': 'At Kebab Bite, we specialize in authentic Halal Mediterranean street food. Our menu features traditional favorites like Rollo Kebab, Kebab en Pan, Kebab Turka, Alitas, Nuggets, and Pizzas, all made with care and authentic spices.',
    'home.storyPara2': 'Located in the heart of Ronda, we invite you to enjoy our delicious Doner Kebab, Burgers, Salads, and fresh ingredients that bring the taste of traditional recipes to every dish. Experience the true essence of Mediterranean street food culture with every bite.',
    'home.visitUs': 'Visit Us',
    'home.address': 'Address',
    'home.hours': 'Hours',
    'home.email': 'Email',
    'home.phone': 'Phone',
    'home.findUs': 'Find Us',
    'home.getDirections': 'Get Directions',
    'home.whatsappAria': 'Contact us on WhatsApp',
    
    // Menu Page
    'menu.title': 'Our Menu',
    'menu.subtitle': 'Explore our delicious selection of authentic kebabs and Mediterranean dishes',
    'menu.orderWhatsapp': 'Place Order via WhatsApp',
    'menu.comingSoon': 'Menu photos coming soon.',
    'menu.error': 'Failed to load menu photos. Please try again later.',
    'menu.previous': 'Previous image',
    'menu.next': 'Next image',
    'menu.closeLightbox': 'Close lightbox',
    'menu.goToImage': 'Go to image',
    
    // Contact Page
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Visit us or reach out — we\'d love to hear from you',
    'contact.address': 'Address',
    'contact.whatsapp': 'WhatsApp',
    'contact.email': 'Email',
    'contact.hours': 'Opening Hours',
    'contact.findUs': 'Find Us',
    'contact.location': 'Location',
    'contact.coordinates': 'Coordinates',
    'contact.getDirections': 'Get Directions',
    'contact.mapTitle': 'Restaurant Location',
    
    // Privacy Policy Page
    'privacy.title': 'Privacy Policy',
    'privacy.intro.title': 'Introduction',
    'privacy.intro.content': 'At Kebab Bite, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.',
    'privacy.collect.title': 'Information We Collect',
    'privacy.collect.intro': 'We collect the following types of information:',
    'privacy.collect.usage': 'Basic Usage Information:',
    'privacy.collect.usageDesc': 'We collect information about how you interact with our website, including pages visited, time spent on pages, and navigation patterns.',
    'privacy.collect.cookies': 'Cookies:',
    'privacy.collect.cookiesDesc': 'We use functional cookies to remember your preferences and improve your browsing experience. These cookies help us understand how visitors use our site.',
    'privacy.collect.contact': 'Contact Information:',
    'privacy.collect.contactDesc': 'When you contact us via WhatsApp, email, or other means, we may collect your name, contact details, and any information you choose to share with us.',
    'privacy.purpose.title': 'Purpose of Data Collection',
    'privacy.purpose.intro': 'We use the collected information for the following purposes:',
    'privacy.purpose.functional': 'Functional Cookies:',
    'privacy.purpose.functionalDesc': 'To remember your cookie consent preferences and provide a seamless browsing experience across visits.',
    'privacy.purpose.analytics': 'Analytics:',
    'privacy.purpose.analyticsDesc': 'To understand how visitors use our website, which helps us improve our content, layout, and services.',
    'privacy.purpose.service': 'Service Delivery:',
    'privacy.purpose.serviceDesc': 'To process your orders, respond to inquiries, and provide customer support.',
    'privacy.purpose.communication': 'Communication:',
    'privacy.purpose.communicationDesc': 'To send you updates about your orders and respond to your questions or feedback.',
    'privacy.cookieMgmt.title': 'Cookie Management',
    'privacy.cookieMgmt.para1': 'We use cookies to enhance your experience on our website. You can manage your cookie preferences at any time by clearing your browser\'s local storage or adjusting your browser settings. Please note that disabling cookies may affect the functionality of certain features on our website.',
    'privacy.cookieMgmt.para2': 'If you previously declined cookies and wish to change your preference, you can clear your browser\'s local storage for this site, and the cookie consent banner will appear again on your next visit.',
    'privacy.security.title': 'Data Security',
    'privacy.security.content': 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
    'privacy.rights.title': 'Your Rights',
    'privacy.rights.intro': 'You have the following rights regarding your personal information:',
    'privacy.rights.access': 'Access:',
    'privacy.rights.accessDesc': 'You have the right to request access to the personal information we hold about you.',
    'privacy.rights.correction': 'Correction:',
    'privacy.rights.correctionDesc': 'You can request that we correct any inaccurate or incomplete information.',
    'privacy.rights.deletion': 'Deletion:',
    'privacy.rights.deletionDesc': 'You can request that we delete your personal information, subject to legal obligations.',
    'privacy.rights.consent': 'Consent Management:',
    'privacy.rights.consentDesc': 'You can withdraw your consent for cookie usage at any time by clearing your browser\'s local storage or adjusting your browser settings.',
    'privacy.rights.portability': 'Data Portability:',
    'privacy.rights.portabilityDesc': 'You have the right to receive your personal data in a structured, commonly used format.',
    'privacy.rights.exercise': 'To exercise any of these rights, please contact us using the information provided on our',
    'privacy.rights.contactPage': 'Contact page',
    'privacy.thirdParty.title': 'Third-Party Services',
    'privacy.thirdParty.content': 'Our website may contain links to third-party services such as WhatsApp, Google Maps, and social media platforms. We are not responsible for the privacy practices of these third-party services. We encourage you to review their privacy policies before providing any personal information.',
    'privacy.updates.title': 'Updates to This Policy',
    'privacy.updates.content': 'We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we protect your information.',
    'privacy.updates.lastUpdated': 'Last updated: November 28, 2025',
    'privacy.contactUs.title': 'Contact Us',
    'privacy.contactUs.content': 'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through our',
    'privacy.contactUs.contactPage': 'Contact page',
    'privacy.contactUs.response': '. We will respond to your inquiry as soon as possible.',
    
    // Cookie Consent
    'cookie.message': 'We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies.',
    'cookie.learnMore': 'Learn more',
    'cookie.accept': 'Accept',
    'cookie.decline': 'Decline',
    'cookie.close': 'Close',
    
    // Footer
    'footer.builtWith': 'Built with',
    'footer.using': 'using',
    
    // Language Toggle
    'lang.spanish': 'Español',
    'lang.english': 'English',
    'lang.toggle': 'Change language',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
