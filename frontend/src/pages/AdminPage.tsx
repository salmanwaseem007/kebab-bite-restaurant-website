import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import MenuPhotosTab from '../components/admin/MenuPhotosTab';
import ContactInfoTab from '../components/admin/ContactInfoTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import { toast } from 'sonner';

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showAccessDenied = isAuthenticated && !showProfileSetup && !isAdminLoading && isAdmin === false;

  const principalId = identity?.getPrincipal().toString() || '';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleCopyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      toast.success('Principal ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy Principal ID');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage your restaurant content</p>
            </div>
            <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'}>
              {disabled ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : isAuthenticated ? (
                'Logout'
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </header>

        <main>
          {!isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>Please log in to access the admin panel</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAuth} disabled={disabled}>
                  {disabled ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login with Internet Identity'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {showProfileSetup && (
            <Card>
              <CardHeader>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>Please enter your name to complete your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={saveProfile.isPending || !name.trim()}>
                    {saveProfile.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {isAuthenticated && !showProfileSetup && (
            <>
              {isAdminLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isAdmin ? (
                <Tabs defaultValue="photos" className="space-y-6">
                  <TabsList className="grid w-full max-w-2xl grid-cols-3">
                    <TabsTrigger value="photos">Menu Photos</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                    <TabsTrigger value="users">Users Management</TabsTrigger>
                  </TabsList>

                  <TabsContent value="photos">
                    <MenuPhotosTab />
                  </TabsContent>

                  <TabsContent value="contact">
                    <ContactInfoTab />
                  </TabsContent>

                  <TabsContent value="users">
                    <AdminUsersTab />
                  </TabsContent>
                </Tabs>
              ) : null}
            </>
          )}
        </main>

        <footer className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Kebab Bite Admin Panel</p>
        </footer>
      </div>

      {/* Access Denied Modal */}
      <Dialog open={showAccessDenied} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
            <DialogDescription>
              You do not have permission to access the admin panel. Only users with admin role can access this area.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Your Principal ID</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={principalId}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyPrincipal}
                  title="Copy Principal ID"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this Principal ID with an administrator to request access.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAuth} variant="outline">
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
