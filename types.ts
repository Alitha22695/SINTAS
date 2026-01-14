
export interface PhotoLocation {
  lat?: number;
  lng?: number;
  name?: string;
}

export interface PhotoRecord {
  id: string;
  url: string;
  filename: string;
  uploadDate: string;
  captureDate: string;
  location: PhotoLocation;
  notes: string;
  tags: string[];
  category: string;
  metadata: {
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
    camera?: string;
  };
}

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type ViewMode = 'GALLERY' | 'TABLE';
