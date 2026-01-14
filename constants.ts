
import { PhotoRecord, User } from './types';

export const MOCK_PHOTOS: PhotoRecord[] = [
  {
    id: '1',
    url: 'https://picsum.photos/id/10/800/600',
    filename: 'mountain_trek.jpg',
    uploadDate: '2024-05-10',
    captureDate: '2024-05-01 14:30',
    location: { lat: 46.8523, lng: 9.5300, name: 'Swiss Alps' },
    notes: 'Breathtaking view of the summit during the spring trek.',
    tags: ['Nature', 'Mountains', 'Landscape'],
    category: 'Travel',
    metadata: { iso: 100, aperture: 'f/8', shutterSpeed: '1/250s', focalLength: '24mm', camera: 'Sony A7IV' }
  },
  {
    id: '2',
    url: 'https://picsum.photos/id/11/800/600',
    filename: 'forest_mist.jpg',
    uploadDate: '2024-05-12',
    captureDate: '2024-05-02 06:15',
    location: { lat: 47.9423, lng: 8.3000, name: 'Black Forest, Germany' },
    notes: 'Early morning fog in the deep woods.',
    tags: ['Forest', 'Fog', 'Mystical'],
    category: 'Nature',
    metadata: { iso: 400, aperture: 'f/2.8', shutterSpeed: '1/60s', focalLength: '35mm', camera: 'Canon R6' }
  },
  {
    id: '3',
    url: 'https://picsum.photos/id/12/800/600',
    filename: 'city_night.jpg',
    uploadDate: '2024-05-15',
    captureDate: '2024-05-10 21:45',
    location: { lat: 40.7128, lng: -74.0060, name: 'New York City' },
    notes: 'Long exposure of Times Square.',
    tags: ['City', 'Night', 'Long Exposure'],
    category: 'Architecture',
    metadata: { iso: 800, aperture: 'f/11', shutterSpeed: '10s', focalLength: '16mm', camera: 'Nikon Z7' }
  },
  {
    id: '4',
    url: 'https://picsum.photos/id/13/800/600',
    filename: 'beach_sunset.jpg',
    uploadDate: '2024-05-18',
    captureDate: '2024-05-15 19:30',
    location: { lat: 34.0195, lng: -118.4912, name: 'Santa Monica Beach' },
    notes: 'Classic sunset at the pier.',
    tags: ['Beach', 'Sunset', 'California'],
    category: 'Nature',
    metadata: { iso: 100, aperture: 'f/5.6', shutterSpeed: '1/500s', focalLength: '50mm', camera: 'Fuji X-T4' }
  }
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@lensbase.com',
  role: 'ADMIN',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};
