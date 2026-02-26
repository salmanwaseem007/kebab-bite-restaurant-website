# Kebab Bite Restaurant Management Application

## Overview
A restaurant management application for "Kebab Bite" with public pages and an admin panel for managing menu photos, contact information, and user roles.

## Layout Structure
- Fixed header with restaurant name "Kebab Bite" and responsive navigation
- Desktop (`md` and above): Horizontal navigation links: Home, Menu, Contact, Privacy Policy
- Mobile (`md` and below): Hamburger menu with dropdown containing same navigation links
- Footer with same navigation links plus Facebook page link
- Header and footer present on all pages except `/admin`
- Styled with Tailwind CSS

## Multilingual Support
- Full Spanish and English support across all non-admin pages (`/`, `/menu`, `/contact`, `/privacy`)
- **Language Toggle**: Button or dropdown in the common header visible on all non-admin pages
- Dynamic text updates without page reload when switching languages
- **Default Language**: Spanish
- Language preference persisted in `localStorage` between visits
- Mobile-friendly, accessible design with ARIA attributes and keyboard navigation
- All links (WhatsApp, View Menu, Get Directions) remain functional in both languages
- Admin panel (`/admin`) remains English-only with no multilingual functionality
- No `/admin` link in navigation or language menus
- Preserve existing CSS styling, add minimal new styles only for responsiveness and accessibility

## Header Navigation Features
- **Desktop Navigation**: Horizontal layout with visible navigation links
- **Mobile Navigation**: 
  - Hamburger button (three-line icon) positioned on the right side of header
  - Toggleable dropdown menu with smooth slide-down/fade-in animations
  - Menu closes when clicking outside or selecting a link
  - Same navigation links as desktop version
- **Language Toggle Integration**: 
  - Positioned appropriately in header for both desktop and mobile layouts
  - Accessible button/dropdown with proper ARIA attributes
  - Maintains responsive design across all screen sizes
- **Accessibility**: 
  - Hamburger button includes ARIA attributes (`aria-expanded`, `aria-controls`)
  - Menu is keyboard-navigable and focusable
  - Language toggle is keyboard accessible and screen reader friendly
  - Maintains existing header styling and colors
- **Responsive Behavior**: Uses Tailwind CSS breakpoints for responsive design

## Cookie Consent Banner
- Displayed globally across all public pages (but not on `/admin` or `/privacy`)
- Appears at the bottom of the page within a small, unobtrusive container (max width `xl`)
- Contains small, mobile-friendly text and buttons (`Accept`, `Decline`)
- Includes a link to the Privacy Policy page
- Persists user consent selection using `localStorage`
- Only shows banner again if the user has not made a choice
- Minimal, non-blocking, and lightweight UI
- **Multilingual**: Text content adapts to selected language (Spanish/English)

## SEO Configuration
- **Sitemap**: Create `sitemap.xml` file in the root of the public directory with URLs for home, menu, contact, and privacy pages, including date `2025-11-30`, changefreq `monthly`, and priority `1.0`
- **Robots.txt**: Create `robots.txt` file in the root directory allowing all user agents full crawl access and referencing the sitemap
- **Homepage SEO Meta Tags** (in Spanish):
  - Title: "Mejores Kebabs en Ronda | Kebabbite"
  - Description: "Disfruta de deliciosos kebabs de pollo, cordero ternera en Kebabbite Ronda. Ordena online para entrega o para llevar."
  - Keywords: "kebabs Ronda, mejores kebabs Ronda, kebabs a la parrilla Ronda, kebab de pollo Ronda, kebab de cordero Ronda, kebab de ternera Ronda, shawarma Ronda, kebabs para llevar Ronda, rollo kebab Ronda, kebab en pan Ronda, pizza turca Ronda, patatas Ronda, alitas Ronda, nuggets Ronda, pizzas Ronda, rollo Ronda, ensalada Ronda, hamburguesas Ronda, bebida Ronda"
  - Robots: "index, follow"
  - Canonical URL: "https://kebabbite.com/"
- **Restaurant Structured Data (JSON-LD)**: Add Restaurant schema markup to homepage with:
  - Restaurant name: "Kebabbite"
  - URL: "https://kebabbite.com"
  - Telephone: "+34 614 55 18 97"
  - Complete address with street, locality, postal code, region, and country
  - Cuisine types: Kebabs, Middle Eastern, Fast Food
  - Menu URL reference
  - Reservation acceptance status
  - Opening hours in structured format
  - Menu sections including all main items (Chicken Kebab, Lamb Kebab, Beef Kebab, Rollo Kebab, Kebab en Pan, Pizza Turca, Patatas, Alitas, Nuggets, Pizzas, Rollo, Ensalada, Hamburguesas, Bebida)

## Pages

### Public Pages
- **Home**: Complete homepage with hero section, story, contact details, and map (Spanish/English)
- **Menu**: Interactive photo gallery with slideshow functionality and WhatsApp ordering (Spanish/English)
- **Contact**: Complete contact page with dynamic contact information and map integration (Spanish/English)
- **Privacy Policy**: Complete privacy policy page with proper content sections (Spanish/English)

### Admin Page (`/admin`)
- No common header/footer layout
- Centered container with semantic HTML sections
- Internet Identity authentication required
- Three-tab interface after login (no nested routes)
- Access control: only users with `admin` role can access the panel
- Access denied modal for non-admin users showing Principal ID with copy to clipboard button
- **English Only**: No multilingual support in admin panel
- **Route Configuration**: Properly configured TanStack Router route with valid path and component definitions, safe property access for route options, and correct component imports without cyclic dependencies

## Home Page Features

### Hero Section
- Full-width background image with semi-transparent dark overlay
- Centered white text overlay with:
  - Title: "Kebab Bite"
  - Subtitle: Multilingual content (Spanish: "Delicious Shawarma & Street-Food Classics." / English equivalent)
  - WhatsApp phone number (from backend) with WhatsApp icon
  - Clickable WhatsApp link: `https://wa.me/WHATSAPP_NUMBER`
  - "View Menu" button (multilingual text)

### Our Story Section
- Centered layout with "Our Story" heading (multilingual)
- Two paragraphs about Mediterranean street food and restaurant location in Ronda (multilingual content)
- **Updated Content**:
  - Paragraph 1 (English): "At Kebab Bite, we specialize in authentic Halal Mediterranean street food. Our menu features traditional favorites like Rollo Kebab, Kebab en Pan, Kebab Turka, Alitas, Nuggets, and Pizzas, all made with care and authentic spices."
  - Paragraph 1 (Spanish): "En Kebab Bite, nos especializamos en auténtica comida callejera mediterránea Halal. Nuestro menú incluye favoritos tradicionales como Rollo Kebab, Kebab en Pan, Kebab Turka, Alitas, Nuggets y Pizzas, todos preparados con esmero y especias auténticas."
  - Paragraph 2 (English): "Located in the heart of Ronda, we invite you to enjoy our delicious Doner Kebab, Burgers, Salads, and fresh ingredients that bring the taste of traditional recipes to every dish. Experience the true essence of Mediterranean street food culture with every bite."
  - Paragraph 2 (Spanish): "Ubicados en el corazón de Ronda, te invitamos a disfrutar de nuestro delicioso Döner Kebab, hamburguesas, ensaladas e ingredientes frescos que traen el sabor de las recetas tradicionales a cada plato. Vive la verdadera esencia de la comida callejera mediterránea en cada bocado."

### Contact Details Section
- Dynamic contact information fetched from backend API
- Display address, opening hours, email (mailto), phone (tel)
- Responsive grid or stacked layout
- **Multilingual Labels**: Section headings and labels adapt to selected language

### Location Map Section
- Lazy-loaded Google Maps embed using backend coordinates
- Responsive map container with rounded corners
- "Get Directions" button linking to Google Maps with coordinates (multilingual text)

### Floating WhatsApp Button
- Persistent round icon at bottom-right corner
- Opens WhatsApp link when clicked
- Visible on both mobile and desktop

### Design Requirements
- Centered container with `max-w-7xl mx-auto px-4`
- Semantic HTML elements for accessibility
- Mobile-first responsive design
- Accessible colors and contrast
- No `/admin` link in navigation
- **Multilingual Content**: All text content dynamically updates based on language selection
- Preserve all existing CSS styling and structure

## Menu Page Features

### Layout Structure
- Common header and footer included
- All content wrapped in centered container with `max-w-7xl mx-auto px-4`
- Semantic HTML with `<header>`, `<main>`, `<footer>`

### WhatsApp Order Section
- "Place Order via WhatsApp" link displayed above gallery (multilingual text)
- Includes small WhatsApp icon
- Opens WhatsApp using contact number from backend: `https://wa.me/WHATSAPP_NUMBER`

### Photo Gallery/Slideshow
- Main image area displaying menu photos from backend
- Images use `object-fit: contain` for proper aspect ratio
- Left/right navigation buttons with wrap-around cycling
- Horizontal thumbnail strip below main image for quick selection
- Fade/opacity transition on image change
- Mobile swipe gesture support
- Clicking main image opens full-screen lightbox with pinch-to-zoom
- Lazy loading for all images
- Fade or slide animations for premium experience

### Empty State
- Display multilingual message when no photos available (Spanish: "Menu photos coming soon." / English equivalent)

### Design Requirements
- Mobile-first responsive design
- Accessibility best practices
- Tailwind CSS for styling
- No `/admin` link anywhere
- **Multilingual Content**: All interface text adapts to selected language

## Contact Page Features

### Layout Structure
- Common header and footer included
- All content wrapped in centered container with `max-w-7xl mx-auto px-4`
- Semantic HTML with `<header>`, `<main>`, `<footer>`

### Contact Information Section
- Dynamic contact information fetched from backend API
- WhatsApp number: Clickable link opening WhatsApp chat (`https://wa.me/WHATSAPP_NUMBER`)
- Email: Clickable mailto link (`mailto:EMAIL_ADDRESS`)
- Address and opening hours displayed with clear, readable typography
- Responsive spacing and mobile-first design
- **Multilingual Labels**: Section headings and contact labels adapt to selected language

### Map Section
- Lazy-loaded Google Maps embed using backend latitude and longitude coordinates
- Responsive map container with `w-full h-64 mt-4 rounded` styling
- Fallback text-based card displayed if map fails to load (multilingual text)
- "Get Directions" button below map linking to `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG` (multilingual text)

### Design Requirements
- Mobile-first responsive design
- Accessible typography and color contrast
- No `/admin` link anywhere
- Adaptive layout for both mobile and desktop views
- **Multilingual Content**: All page content adapts to selected language

## Privacy Policy Page Features

### Layout Structure
- Common header and footer included
- All content wrapped in centered container with `max-w-7xl mx-auto px-4`
- Semantic HTML with `<header>`, `<main>`, `<footer>`
- Cookie consent banner does not appear on this page

### Content Sections
- Clear sections explaining:
  - Data collected (basic cookie and usage info)
  - Purpose (functional cookies, analytics)
  - User rights (data removal, consent management)
  - Link back to cookie consent information
- Mobile-friendly responsive layout
- Accessible typography and proper content structure
- **Multilingual Content**: Complete privacy policy content in both Spanish and English

### Design Requirements
- Mobile-first responsive design
- Readable typography with proper spacing
- No `/admin` link anywhere
- Consistent styling with other public pages
- **Language Adaptation**: All content dynamically updates based on language selection

## Admin Panel Features

### Access Control
- Internet Identity authentication required
- Only users with `admin` role can access the admin panel
- Non-admin users see access denied modal with their Principal ID and copy to clipboard functionality

### Tab 1: Menu Photos
- Multiple file upload with preview functionality
- Image gallery with grid/list display
- Delete and reorder (Up/Down) functionality for images
- Admin preview mode to simulate user menu view
- Automatic WebP conversion before saving
- Lazy loading and fade/slide animations
- Image management and organization

### Tab 2: Contact Info
- Form with the following fields:
  - Restaurant Name
  - WhatsApp phone number
  - Address
  - Email
  - Opening hours (single text field)
  - Latitude
  - Longitude
- Pre-filled default values:
  - Address: "C. el Niño, 4, 29400 Ronda, Málaga"
  - Phone: "+34 614 55 18 97"
  - Email: "mian.ftikhar@gmail.com"
  - Latitude: 36.744078
  - Longitude: -5.166929
  - Opening hours with Spanish weekday schedule
- Form validation for coordinates, WhatsApp, email, and address
- Interactive map with draggable pin for coordinate adjustment
- Save Changes and Test Map buttons

### Tab 3: Users Management
- Add User Section:
  - Input field for Internet Identity Principal ID
  - Add button with plus icon only
  - Principal ID format validation
  - Automatically assigns admin role to new users
  - Duplicate-safe logic for existing users
  - Success/error notifications for all actions
- Users Table:
  - Display all users with Principal ID, Current Role, and Actions columns
  - User roles: admin, user, guest
  - Search bar to filter users by Principal ID
  - Role filter dropdown to view specific roles
  - Promote and Demote buttons for role management
  - Prevent demotion of the last remaining admin
- Consistent styling with other admin tabs

### Admin Panel Language
- **English Only**: Admin panel remains in English with no multilingual functionality
- No language toggle or multilingual content in admin interface

## Internet Identity Configuration
- Create `ii-alternative-origins` file in `frontend/public/.well-known/` directory
- File contains JSON configuration with alternative origins: `{"alternativeOrigins": ["https://www.kebabbite.com","https://kebabbite.com"]}`
- File must be properly exposed in the build output to maintain Internet Identity compatibility

## Backend Data Storage
- Menu photos with order information
- Contact information including coordinates
- User roles and Principal IDs
- Image files converted to WebP format

## Backend Operations
- Upload and store menu images
- Manage image ordering and deletion
- Save and retrieve contact information
- Handle image format conversion to WebP
- Provide contact information API for Home page
- Provide menu photos API for Menu page gallery
- Provide contact information API for Contact page
- User role management operations:
  - Assign user roles
  - Get user roles
  - Check admin status
  - Fetch all users and their roles
  - Role promotion and demotion with authorization checks

## CORS and Security Configuration
- Backend canister configured to handle requests securely from trusted domains: `https://www.kebabbite.com` and `https://kebabbite.com`
- Dynamic CORS headers added to all HTTP responses:
  - `Access-Control-Allow-Origin`: Set dynamically based on request origin (only for trusted domains)
  - `Access-Control-Allow-Methods`: Include appropriate HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
  - `Access-Control-Allow-Headers`: Include necessary headers for authentication and content types
- Authorization checks updated to treat both trusted origins as valid for authenticated calls and admin access
- Preflight OPTIONS requests handled properly for cross-origin requests

## Authentication
- Internet Identity integration for admin access
- Admin panel protected behind authentication and role-based access control
- Role-based authorization for all admin operations
- Cross-origin authentication support for both trusted domains

## Technical Requirements
- Application language: Spanish (default) with English support on public pages
- No direct `/admin` link in navigation (manual access only)
- Map integration for contact information display
- Image optimization and lazy loading
- Form validation and error handling
- Google Maps integration with coordinates from backend
- Mobile swipe gesture support for menu gallery
- Full-screen lightbox with pinch-to-zoom functionality
- Cookie consent management using localStorage
- Privacy policy page with proper content structure
- Role-based access control with Principal ID validation
- User management with search and filtering capabilities
- Responsive mobile hamburger menu with smooth animations
- **Multilingual Implementation**: 
  - Language toggle in header with localStorage persistence
  - Dynamic content switching without page reload
  - Accessible language selection with ARIA attributes
  - Mobile-friendly responsive design for language toggle
- **Router Configuration**: Ensure all route definitions have proper path and component properties, safe destructuring of route options with default values, and proper component exports without circular dependencies
