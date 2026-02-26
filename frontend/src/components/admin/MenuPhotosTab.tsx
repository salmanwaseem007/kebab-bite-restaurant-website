import { useState, useRef } from 'react';
import { useGetMenuPhotos, useAddMenuPhoto, useDeleteMenuPhoto, useReorderMenuPhotos } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Trash2, ChevronUp, ChevronDown, Loader2, Eye, AlertCircle } from 'lucide-react';
import type { MenuPhoto } from '../../backend';

// Convert image to WebP
async function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        'image/webp',
        0.9
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export default function MenuPhotosTab() {
  const { data: photos, isLoading } = useGetMenuPhotos();
  const addPhoto = useAddMenuPhoto();
  const deletePhoto = useDeleteMenuPhoto();
  const reorderPhotos = useReorderMenuPhotos();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        // Convert to WebP
        const webpBlob = await convertToWebP(file);
        
        // Convert to base64 for storage
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(webpBlob);
        });
        const base64 = await base64Promise;

        const photo: MenuPhoto = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: base64,
          order: BigInt(photos?.length || 0),
          name: file.name.replace(/\.[^/.]+$/, ''),
        };

        await addPhoto.mutateAsync(photo);
      }

      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await deletePhoto.mutateAsync(photoId);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (!photos || index === 0) return;
    const newOrder = [...photos];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    await reorderPhotos.mutateAsync(newOrder.map((p) => p.id));
  };

  const handleMoveDown = async (index: number) => {
    if (!photos || index === photos.length - 1) return;
    const newOrder = [...photos];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    await reorderPhotos.mutateAsync(newOrder.map((p) => p.id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Menu Photos</CardTitle>
          <CardDescription>Add photos of your menu items. Images will be automatically converted to WebP format.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
            <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected files:</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border border-border p-2 text-sm">
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Photos Gallery</CardTitle>
              <CardDescription>Manage and reorder your menu photos</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
              <Eye className="mr-2 h-4 w-4" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          ) : !photos || photos.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No menu photos uploaded yet. Upload your first photo above.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {!previewMode && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0 || reorderPhotos.isPending}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === photos.length - 1 || reorderPhotos.isPending}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletePhoto.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="truncate text-sm font-medium">{photo.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
