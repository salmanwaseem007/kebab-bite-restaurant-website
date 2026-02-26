import { useState, useEffect } from 'react';
import { useGetContactInfo, useUpdateContactInfo } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, MapPin } from 'lucide-react';
import type { ContactInfo } from '../../backend';

export default function ContactInfoTab() {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const updateInfo = useUpdateContactInfo();
  const [formData, setFormData] = useState<ContactInfo | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await updateInfo.mutateAsync(formData);
      alert('Contact information updated successfully!');
    } catch (error) {
      console.error('Failed to update contact info:', error);
      alert('Failed to update contact information. Please try again.');
    }
  };

  const handleChange = (field: keyof ContactInfo, value: string | number) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+?[\d\s-]+$/.test(phone);
  };

  if (isLoading || !formData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update your restaurant's contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  value={formData.restaurantName}
                  onChange={(e) => handleChange('restaurantName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Phone Number</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  required
                  pattern="^\+?[\d\s-]+$"
                  title="Please enter a valid phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                  required
                  min="-90"
                  max="90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                  required
                  min="-180"
                  max="180"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingHours">Opening Hours</Label>
              <Textarea
                id="openingHours"
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                rows={8}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updateInfo.isPending}>
                {updateInfo.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowMap(!showMap)}>
                <MapPin className="mr-2 h-4 w-4" />
                {showMap ? 'Hide Map' : 'Test Map'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showMap && (
        <Card>
          <CardHeader>
            <CardTitle>Map Preview</CardTitle>
            <CardDescription>Preview how your location will appear to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] overflow-hidden rounded-lg border border-border">
              <iframe
                src={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}&hl=es&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location Preview"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
