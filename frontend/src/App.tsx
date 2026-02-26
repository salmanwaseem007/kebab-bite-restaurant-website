import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useLocation } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminPage from './pages/AdminPage';
import { LanguageProvider } from './lib/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const isPrivacyPage = location.pathname === '/privacy';

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminPage && <Header />}
      <div className="flex-1">
        <Outlet />
      </div>
      {!isAdminPage && <Footer />}
      {!isAdminPage && !isPrivacyPage && <CookieConsent />}
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicyPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([indexRoute, menuRoute, contactRoute, privacyRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

